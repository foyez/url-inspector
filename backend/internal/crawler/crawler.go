package crawler

import (
	"context"
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

func CrawlWithContext(ctx context.Context, targetURL string) (*CrawlerResult, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, targetURL, nil)
	if err != nil {
		return nil, fmt.Errorf("request error: %w", err)
	}

	rsp, err := http.DefaultClient.Do(req)
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
	select {
	case <-ctx.Done():
		return nil, fmt.Errorf("crawl cancelled after reading body")
	default:
	}
	htmlString := string(bodyBytes)

	// Detect HTML version
	result.HTMLVersion = detectHTMLVersion(htmlString)

	// Parse HTML with goquery
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

	doc.Find("a[href]").EachWithBreak(func(i int, s *goquery.Selection) bool {
		select {
		case <-ctx.Done():
			return false
		default:
		}

		href, exists := s.Attr("href")
		if !exists || href == "" || strings.HasPrefix(href, "javascript:") {
			return true
		}

		absURL := toAbsoluteURL(baseURL, href)
		if absURL == "" {
			return true
		}

		if isInternal(absURL, baseURL.Hostname()) {
			result.InternalLinks = append(result.InternalLinks, absURL)
		} else {
			result.ExternalLinks = append(result.ExternalLinks, absURL)
		}
		return true
	})

	// Check broken links
	for _, link := range append(result.InternalLinks, result.ExternalLinks...) {
		select {
		case <-ctx.Done():
			return nil, fmt.Errorf("crawl cancelled during link check")
		default:
		}

		code := checkLinkStatusWithContext(ctx, link)
		if code >= 400 {
			result.BrokenLinks[link] = code
		}
	}

	return result, nil
}
