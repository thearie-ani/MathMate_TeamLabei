import axios from "axios";
import * as cheerio from "cheerio";
import {parseOpenstaxUrl} from "./parseOpenstaxUrl.js";
import { cleanHtml } from "./htmlCleaner.js";
/**
 * Fetches an OpenStax page and returns everything the admin needs to review
 * in the Tiptap editor before saving:
 *   { bookSlug, pageSlug, chapter, order, suggestedTitle, contentHtml, sourceUrl }
 *
 * This does NOT save anything to the database - the frontend loads the
 * result into the editor first so the admin can edit, then POSTs the
 * final version to POST /api/lessons like any other lesson.
 */
export async function importFromOpenstax(sourceUrl) {
  const { bookSlug, pageSlug, chapter, order, slugWords } = parseOpenstaxUrl(sourceUrl);

  const { data: html } = await axios.get(sourceUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LearningPlatformImporter/1.0)' },
    timeout: 15000,
  });

  const $ = cheerio.load(html);

  // OpenStax renders each page inside <div id="main-content"> (page body)
  // with the heading inside it. Fall back to <main> or <article> if the
  // markup differs between books.
  const container =
    $('#main-content').first().length
      ? $('#main-content').first()
      : $('main').first().length
      ? $('main').first()
      : $('article').first();

  if (!container || container.length === 0) {
    throw new Error('Could not locate the main content container on that page. The page markup may have changed.');
  }

  // Remove chrome that isn't lesson content: nav, script/style, "Learning
  // Objectives" side-notes stay (they're useful), but skip-links, footers,
  // attribution/licensing blocks and social buttons are noise.
  container
    .find('script, style, nav, footer, .os-eob, .os-attribution, .skip-to-content, .os-figure-attribution, [role="navigation"]')
    .remove();

  const suggestedTitle =
    container.find('h1').first().text().trim() ||
    $('title').text().split('-')[0].trim() ||
    slugWords.replace(/-/g, ' ');

  const contentHtml = cleanHtml(container.html() || '');

  if (!contentHtml) {
    throw new Error('The page was fetched successfully but no readable content was found inside it.');
  }

  return {
    bookSlug,
    pageSlug,
    chapter,
    order,
    suggestedTitle,
    contentHtml,
    sourceUrl,
  };
}

