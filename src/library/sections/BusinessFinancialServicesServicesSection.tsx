import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  ComprehensiveCTA,
  createItemSource,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  MaybeRTF,
  type ComprehensiveCTAValue,
  type EnhancedTranslatableCTA,
  type RichText,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  resolveComponentData,
  useDocument,
  VisibilityWrapper,
} from "@yext/visual-editor";

const servicesTypographyScopeClass = "bfs-services-typography";
const servicesTypographyStyles = `
  .${servicesTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${servicesTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${servicesTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${servicesTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${servicesTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${servicesTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${servicesTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${servicesTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${servicesTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${servicesTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
`;

type StyledTextField = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledTextStyles = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type ServiceItem = {
  title: YextEntityField<TranslatableString>;
  body: YextEntityField<TranslatableRichText>;
  cta: YextEntityField<EnhancedTranslatableCTA>;
};

const serviceItemDefault = (
  title: string,
  body: string,
  ctaLabel: string,
): ServiceItem => ({
  title: {
    field: "",
    constantValue: { defaultValue: title, hasLocalizedValue: "true" },
    constantValueEnabled: true,
  },
  body: {
    field: "",
    constantValue: {
      defaultValue: getDefaultRTF(body),
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  cta: {
    field: "",
    constantValue: {
      label: { defaultValue: ctaLabel, hasLocalizedValue: "true" },
      link: { defaultValue: "#footer", hasLocalizedValue: "true" },
      linkType: "URL",
      ctaType: "textAndLink",
    },
    constantValueEnabled: true,
  },
});

const servicesSource = createItemSource<ServiceItem>({
  label: "Services",
  mappingFields: {
    title: {
      label: "Title",
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    body: {
      label: "Body",
      type: "entityField",
      filter: { types: ["type.rich_text_v2"] },
    },
    cta: {
      label: "Call to Action",
      type: "entityField",
      filter: { types: ["type.cta"] },
    },
  },
  defaultValues: [
    serviceItemDefault(
      "Wealth Management",
      "Portfolio oversight and account reviews support for clients seeking ongoing guidance.",
      "Discuss with [[name]]",
    ),
    serviceItemDefault(
      "Retirement Planning",
      "Planning conversations for retirement timelines, income needs, and account coordination.",
      "Talk to [[name]] [[address.city]]",
    ),
    serviceItemDefault(
      "Investment Management",
      "Ongoing investment strategy support based on client objectives and risk considerations.",
      "Request an investment review",
    ),
    serviceItemDefault(
      "Financial Planning",
      "Goal-based planning conversations covering cash flow, savings, and long-term priorities.",
      "Speak with an advisor",
    ),
  ],
});

const serviceCtaStyles: ComprehensiveCTAValue["styles"] = {
  variant: "secondary",
  color: undefined,
  button: {
    fontFamily: "default",
    fontSize: "default",
    fontWeight: "default",
    fontStyle: "default",
    textTransform: "default",
    borderRadius: "999px",
    letterSpacing: "default",
  },
};

export type BusinessFinancialServicesServicesSectionProps = {
  headingBrow: StyledTextField;
  heading: StyledTextField;
  cardStyles: {
    title: StyledTextStyles;
    body: StyledTextStyles;
  };
  services: typeof servicesSource.value;
  footerCta: Partial<ComprehensiveCTAValue>;
  cardSurface: {
    backgroundColor: ThemeColor;
  };
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const resolveThemeColorCssValue = (
  value?: string | ThemeColor,
): string | undefined => {
  if (!value) return undefined;
  const color = typeof value === "string" ? value : value.selectedColor;
  if (color.startsWith("[") && color.endsWith("]")) {
    return color.slice(1, -1);
  }
  if (color === "white") return "#ffffff";
  if (color.endsWith("-light")) {
    const base = color.replace(/-light$/, "");
    return `hsl(from var(--colors-${base}) h s 98)`;
  }
  if (color.endsWith("-dark")) {
    const base = color.replace(/-dark$/, "");
    return `hsl(from var(--colors-${base}) h s 20)`;
  }
  if (color.startsWith("palette-")) {
    return `var(--colors-${color})`;
  }
  return color;
};

const resolveSurfaceForegroundColor = (
  surfaceColor?: ThemeColor,
): string | undefined =>
  surfaceColor?.contrastingColor
    ? resolveThemeColorCssValue({
        selectedColor: surfaceColor.contrastingColor,
        contrastingColor: surfaceColor.selectedColor,
      })
    : undefined;

const getTextStyles = (
  styles: StyledTextValue,
  color?: string | ThemeColor,
): React.CSSProperties => ({
  color: resolveThemeColorCssValue(color),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

type RichTextStyleOverrides = Omit<Partial<StyledTextValue>, "color"> & {
  color?: ThemeColor | string;
};

const renderRichText = (
  value: unknown,
  richTextStyleOverrides: RichTextStyleOverrides,
) => {
  if (React.isValidElement(value)) return value;
  if (typeof value === "string") {
    return (
      <MaybeRTF data={value} richTextStyleOverrides={richTextStyleOverrides} />
    );
  }
  return (
    <MaybeRTF
      data={value as RichText | undefined}
      richTextStyleOverrides={richTextStyleOverrides}
    />
  );
};

const BusinessFinancialServicesServicesSectionFields: YextFields<BusinessFinancialServicesServicesSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    cardSurface: {
      label: "Card Surface",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    headingBrow: {
      label: "Heading Brow",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    heading: {
      label: "Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    cardStyles: {
      label: "Card Styles",
      type: "object",
      objectFields: {
        title: {
          label: "Title",
          type: "object",
          objectFields: {
            styles: { label: "Text Styles", type: "styledText" },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        body: {
          label: "Body",
          type: "object",
          objectFields: {
            styles: { label: "Text Styles", type: "styledText" },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
    services: servicesSource.field,
    footerCta: {
      label: "Footer Call to Action",
      type: "comprehensiveCTA",
    },
  };

export const BusinessFinancialServicesServicesSectionComponent: PuckComponent<
  BusinessFinancialServicesServicesSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextBusinessFinancialServicesServicesSection${getAnalyticsScopeHash(
    props.id,
  )}`;
  const brow =
    resolveComponentData(props.headingBrow.text, locale, streamDocument) || "";
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const sectionForeground = resolveSurfaceForegroundColor(
    props.section.backgroundColor,
  );
  const cardForeground = resolveSurfaceForegroundColor(
    props.cardSurface.backgroundColor,
  );
  const cardBodyRichTextStyleOverrides: RichTextStyleOverrides = {
    ...props.cardStyles.body.styles,
    color:
      props.cardStyles.body.fontColor ??
      props.cardSurface.backgroundColor.contrastingColor,
  };
  const services = servicesSource.resolveItems(props.services, streamDocument);

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <section
          className={`${servicesTypographyScopeClass} px-0 pb-[60px] pt-10`}
          style={{
            backgroundColor: resolveThemeColorCssValue(
              props.section.backgroundColor,
            ),
            color: sectionForeground,
          }}
        >
          <style>{servicesTypographyStyles}</style>
          <div className="mx-auto w-full max-w-[1440px] px-[22px]">
            <EntityField
              displayName="Heading Brow"
              fieldId={props.headingBrow.text.field}
              constantValueEnabled={props.headingBrow.text.constantValueEnabled}
            >
              <p
                className="font-[family:var(--fontFamily-body-fontFamily)] m-0 text-center text-base leading-6"
                style={getTextStyles(
                  props.headingBrow.styles,
                  props.headingBrow.fontColor,
                )}
              >
                {brow}
              </p>
            </EntityField>
            <EntityField
              displayName="Heading"
              fieldId={props.heading.text.field}
              constantValueEnabled={props.heading.text.constantValueEnabled}
            >
              <h2
                className="font-[family:var(--fontFamily-h2-fontFamily)] mt-2 text-center text-[28px] font-normal leading-[1.3] md:text-[36px]"
                style={getTextStyles(
                  props.heading.styles,
                  props.heading.fontColor,
                )}
              >
                {heading}
              </h2>
            </EntityField>
            <EntityField
              displayName="Services"
              fieldId={props.services.field}
              constantValueEnabled={props.services.constantValueEnabled}
            >
              <div className="mt-7 grid gap-2 md:grid-cols-2">
                {services.map((item, index) => {
                  const title = item.title
                    ? resolveComponentData(item.title, locale, streamDocument)
                    : "";
                  const body = item.body
                    ? resolveComponentData(item.body, locale, streamDocument, {
                        richTextStyleOverrides: cardBodyRichTextStyleOverrides,
                      })
                    : undefined;
                  return (
                    <article
                      key={`${title}-${index}`}
                      className="flex min-h-[192px] min-w-0 flex-col items-center justify-center px-5 py-8 text-center sm:px-8"
                      style={{
                        backgroundColor: resolveThemeColorCssValue(
                          props.cardSurface.backgroundColor,
                        ),
                        color: cardForeground,
                      }}
                    >
                      <h3
                        className="font-[family:var(--fontFamily-h3-fontFamily)] text-2xl font-medium leading-[1.3]"
                        style={getTextStyles(
                          props.cardStyles.title.styles,
                          props.cardStyles.title.fontColor,
                        )}
                      >
                        {title}
                      </h3>
                      <div className="font-[family:var(--fontFamily-body-fontFamily)] mt-[18px] max-w-full text-base leading-[1.6]">
                        {renderRichText(body, cardBodyRichTextStyleOverrides)}
                      </div>
                      {item.cta ? (
                        <div className="mt-5 w-full max-w-full sm:w-auto">
                          <ComprehensiveCTA
                            value={{
                              data: {
                                actionType: "link",
                                cta: {
                                  field: "",
                                  constantValue: item.cta,
                                  constantValueEnabled: true,
                                  selectedType: item.cta.ctaType,
                                },
                                openInNewTab: item.cta.openInNewTab ?? false,
                              },
                              styles: serviceCtaStyles,
                            }}
                            className="inline-flex min-h-[42px] w-full items-center justify-center rounded-full border border-current px-5 py-2.5 text-center no-underline sm:w-auto"
                          />
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </EntityField>
            <div className="mt-6 flex justify-center">
              <EntityField
                displayName="Footer Call to Action"
                fieldId={props.footerCta.data?.cta?.field}
                constantValueEnabled={
                  props.footerCta.data?.cta?.constantValueEnabled
                }
              >
                <ComprehensiveCTA
                  value={props.footerCta as Partial<ComprehensiveCTAValue>}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full px-5 py-2.5 no-underline"
                />
              </EntityField>
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesServicesSection: YextComponentConfig<BusinessFinancialServicesServicesSectionProps> =
  {
    label: "Services Section",
    fields: BusinessFinancialServicesServicesSectionFields,
    defaultProps: {
      headingBrow: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Better. Faster. Stronger.",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "FEATURED SERVICES",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "uppercase",
        },
        fontColor: undefined,
      },
      cardStyles: {
        title: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        body: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
      },
      services: servicesSource.defaultValue,
      footerCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "View all services",
                hasLocalizedValue: "true",
              },
              link: { defaultValue: "#footer", hasLocalizedValue: "true" },
              linkType: "URL",
              ctaType: "textAndLink",
            },
            constantValueEnabled: true,
            selectedType: "textAndLink",
          },
          openInNewTab: false,
        },
        styles: {
          variant: "primary",
          color: {
            selectedColor: "palette-secondary",
            contrastingColor: "palette-secondary-contrast",
          },
          button: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            borderRadius: "999px",
            letterSpacing: "default",
          },
        },
      },
      cardSurface: {
        backgroundColor: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
      },
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        visibleOnLivePage: true,
      },
    },
    render: (props) => (
      <BusinessFinancialServicesServicesSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesServicesSection",
  displayName: "Services Section",
  description: "Services Section",
  pageSetTypes: ["ENTITY"],
};
