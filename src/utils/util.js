
/*if (blob.type.match(/^image/)) {

  const img = document.createElement('img');
  img.src = URL.createObjectURL(blob);

} else if (blob.type.match(/pdf$/)) {
  const iframe = document.createElement('iframe');
  iframe.src = URL.createObjectURL(blob);
}*/

export function urlValidation(url) {
  const validURLRegex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
  return validURLRegex.test(url);
}
