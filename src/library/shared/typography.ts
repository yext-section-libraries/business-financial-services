const bodyTypography = `
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);`;

export const createScopedTypographyStyles = (
  scopeClass: string,
  additionalBodySelectors: string[] = [],
): string => {
  const bodyRules = ["p", "li", ...additionalBodySelectors]
    .map((selector) => `.${scopeClass} ${selector} {${bodyTypography}\n  }`)
    .join("\n");
  const headingRules = [1, 2, 3, 4, 5, 6]
    .map(
      (level) => `.${scopeClass} h${level} {
    font-family: var(--fontFamily-h${level}-fontFamily);
    font-size: var(--fontSize-h${level}-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h${level}-fontWeight);
    font-style: var(--fontStyle-h${level}-fontStyle);
    text-transform: var(--textTransform-h${level}-textTransform);
  }`,
    )
    .join("\n");

  return `${bodyRules}
${headingRules}
  .${scopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${scopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }`;
};
