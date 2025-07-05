package crawler

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type CrawlerResult struct {
	Title         string
	HTMLVersion   string
	Headings      map[string]int
	InternalLinks []string
	ExternalLinks []string
	BrokenLinks   map[string]int
	HasLoginForm  bool
}

func Crawl(targetURL string) (*CrawlerResult, error) {
	rsp, err := http.Get(targetURL)
	if err != nil {
		return nil, fmt.Errorf("fetch error: %w", err)
	}
	defer rsp.Body.Close()

	if rsp.StatusCode >= 400 {
		return nil, fmt.Errorf("bad status: %d", rsp.StatusCode)
	}

	result := &CrawlerResult{
		Headings:      make(map[string]int),
		BrokenLinks:   make(map[string]int),
		InternalLinks: []string{},
		ExternalLinks: []string{},
	}

	// Read raw HTML
	bodyBytes, err := io.ReadAll(rsp.Body)
	if err != nil {
		return nil, fmt.Errorf("read error: %w", err)
	}
	htmlString := string(bodyBytes)

	// Detect HTML version
	result.HTMLVersion = detectHTMLVersion(htmlString)

	// Parse with goquery
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(htmlString))
	if err != nil {
		return nil, fmt.Errorf("parse error: %w", err)
	}

	// Get the title
	result.Title = doc.Find("title").Text()

	// Count headings
	for i := 1; i <= 6; i++ {
		tag := fmt.Sprintf("h%d", i)
		result.Headings[tag] = doc.Find(tag).Length()
	}

	// Detect login form
	result.HasLoginForm = doc.Find("input[type='password']").Length() > 0

	// Extract links
	baseURL, err := url.Parse(targetURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse url: %w", err)
	}

	doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
		href, exists := s.Attr("href")
		if !exists || href == "" || strings.HasPrefix(href, "javascript:") {
			return
		}

		absURL := toAbsoluteURL(baseURL, href)
		if absURL == "" {
			return
		}

		if isInternal(absURL, baseURL.Hostname()) {
			result.InternalLinks = append(result.InternalLinks, absURL)
		} else {
			result.ExternalLinks = append(result.ExternalLinks, absURL)
		}
	})

	// Check broken links
	for _, link := range append(result.InternalLinks, result.ExternalLinks...) {
		code := checkLinkStatus(link)
		if code >= 400 {
			result.BrokenLinks[link] = code
		}
	}

	return result, nil
}
