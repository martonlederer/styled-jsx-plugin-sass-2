const sass = require('node-sass');
const stripIndent = require('strip-indent');

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/%%styled-jsx-placeholder-(\d+)%%(\w*\s*[),;!{])/g, (_, id, p1) =>
      `styled-jsx-placeholder-${id}-${p1}`
    )
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    )

  // Prepend option data to cssWithPlaceholders
  const optionData = settings.sassOptions && settings.sassOptions.data || "";
  let data = optionData + "\n" + cssWithPlaceholders;

  // clean up extra indent if we are using indentedSyntax
  if(settings.sassOptions && settings.sassOptions.indentedSyntax) data = stripIndent(data);

  const preprocessed = sass.renderSync(
    Object.assign(
      {},
      settings.sassOptions,
      { data }
    )).css.toString()

  return preprocessed
    .replace(/styled-jsx-placeholder-(\d+)-(\w*\s*[),;!{])/g, (_, id, p1) =>
      `%%styled-jsx-placeholder-${id}%%${p1}`
    )
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}
