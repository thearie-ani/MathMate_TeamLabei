import DOMPurify from "dompurify";


export function sanitizeQuillHtml(html){

  return DOMPurify.sanitize(html);

}