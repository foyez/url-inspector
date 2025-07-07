package crawler

import (
	"context"
	"net/http"
	"net/url"
	"strings"
	"time"
)

func detectHTMLVersion(html string) string {
	lowerHtml := strings.ToLower(html)
	if strings.HasPrefix(lowerHtml, "<!doctype html>") {
		return "HTML5"
	}

	if strings.Contains(lowerHtml, "xhtml 1.0") {
		return "XHTML 1.0"
	}
	if strings.Contains(lowerHtml, "xhtml 1.1") {
		return "XHTML 1.1"
	}
	if strings.Contains(lowerHtml, "html 4.01 transitional") {
		return "HTML 4.01 Transitional"
	}
	if strings.Contains(lowerHtml, "html 4.01 strict") {
		return "HTML 4.01 Strict"
	}
	if strings.Contains(lowerHtml, "html 4.01 frameset") {
		return "HTML 4.01 Frameset"
	}
	if strings.Contains(lowerHtml, "html 3.2") {
		return "HTML 3.2"
	}

	return "Unknown"
}

func toAbsoluteURL(base *url.URL, href string) string {
	url, err := base.Parse(href)
	if err != nil {
		return ""
	}
	return url.String()
}

func isInternal(link string, hostname string) bool {
	url, err := url.Parse(link)
	if err != nil {
		return false
	}
	return url.Hostname() == hostname
}

func checkLinkStatusWithContext(ctx context.Context, link string) int {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, link, nil)
	if err != nil {
		return 0
	}

	// TODO: bot protection issue: Linkedin, Leetcode, etc.

	client := &http.Client{
		Timeout: 5 * time.Second,
	}

	rsp, err := client.Do(req)
	if err != nil {
		return 0
	}
	defer rsp.Body.Close()

	return rsp.StatusCode
}
