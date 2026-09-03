import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, useAnalytics } from "@yext/pages-components";
import {
  createItemSource,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  MaybeRTF,
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

const faqTypographyScopeClass = "bfs-faq-typography";
const faqTypographyStyles = `
  .${faqTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${faqTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${faqTypographyScopeClass} button {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${faqTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${faqTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${faqTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${faqTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${faqTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${faqTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${faqTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${faqTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
`;
import { FaPlus, FaMinus } from "react-icons/fa";

type StyledTextField = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledTextStyles = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type FaqItem = {
  question: YextEntityField<TranslatableString | TranslatableRichText>;
  answer: YextEntityField<TranslatableRichText>;
};

export type BusinessFinancialServicesFaqSectionProps = {
  heading: StyledTextField;
  faqStyles: {
    question: StyledTextStyles;
    answer: StyledTextStyles;
  };
  faqs: typeof faqsSource.value;
  itemSurface: {
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
  if (color.startsWith("palette-")) return `var(--colors-${color})`;
  return color;
};

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

const faqItemDefault = (question: string, answer: string): FaqItem => ({
  question: {
    field: "",
    constantValue: { defaultValue: question, hasLocalizedValue: "true" },
    constantValueEnabled: true,
  },
  answer: {
    field: "",
    constantValue: {
      defaultValue: getDefaultRTF(answer),
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
});

const faqsSource = createItemSource<FaqItem>({
  label: "FAQs",
  mappingFields: {
    question: {
      label: "Question",
      type: "entityField",
      filter: { types: ["type.string", "type.rich_text_v2"] },
    },
    answer: {
      label: "Answer",
      type: "entityField",
      filter: { types: ["type.rich_text_v2"] },
    },
  },
  defaultValues: [
    faqItemDefault(
      "Do I need an appointment to visit this office?",
      "Appointments are recommended for planning and advisory meetings, but clients can stop by during office hours for general assistance.",
    ),
    faqItemDefault(
      "Is parking available nearby?",
      "Yes. Visitor parking is available nearby with additional [[address.city]] access options.",
    ),
    faqItemDefault(
      "Can I meet with an advisor virtually?",
      "Yes. This location offers both in-person and virtual financial planning conversations.",
    ),
    faqItemDefault(
      "What languages are supported at this office?",
      "This branch supports clients in English, Spanish, Chinese, and French.",
    ),
    faqItemDefault(
      "Is this office accessible by public transit?",
      "Yes. The office is accessible by public transit and is close to major Uptown connections.",
    ),
  ],
});

const BusinessFinancialServicesFaqSectionFields: YextFields<BusinessFinancialServicesFaqSectionProps> =
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
    faqStyles: {
      label: "FAQ Styles",
      type: "object",
      objectFields: {
        question: {
          label: "Question",
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
        answer: {
          label: "Answer",
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
    faqs: faqsSource.field,
    itemSurface: {
      label: "Item Surface",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
  };

export const BusinessFinancialServicesFaqSectionComponent: PuckComponent<
  BusinessFinancialServicesFaqSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const analytics = useAnalytics();
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const scopeName = `YextBusinessFinancialServicesFaqSection${getAnalyticsScopeHash(
    props.id,
  )}`;
  const sectionForeground = props.section.backgroundColor.contrastingColor;
  const itemForeground = props.itemSurface.backgroundColor.contrastingColor;
  const answerRichTextStyleOverrides: RichTextStyleOverrides = {
    ...props.faqStyles.answer.styles,
    color: props.faqStyles.answer.fontColor ?? itemForeground,
  };
  const faqs = faqsSource.resolveItems(props.faqs, streamDocument);
  const [openIndexes, setOpenIndexes] = React.useState<Set<number>>(
    () => new Set(faqs.length > 0 ? [0] : []),
  );
  const indexedFaqs = faqs.map((item, index) => ({ item, index }));
  const columnBreak = Math.ceil(indexedFaqs.length / 2);
  const faqColumns = [
    indexedFaqs.slice(0, columnBreak),
    indexedFaqs.slice(columnBreak),
  ];

  const toggleFaq = (index: number) => {
    setOpenIndexes((current) => {
      const next = new Set(current);
      const willOpen = !next.has(index);
      if (willOpen) {
        next.add(index);
      } else {
        next.delete(index);
      }
      analytics?.track({
        action: willOpen ? "EXPAND" : "COLLAPSE",
        eventName: `faqToggle${index}`,
      });
      return next;
    });
  };

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <section
          className={`${faqTypographyScopeClass} px-0 py-[60px]`}
          style={{
            backgroundColor: resolveThemeColorCssValue(
              props.section.backgroundColor,
            ),
            color: `var(--colors-${sectionForeground})`,
          }}
        >
          <style>{faqTypographyStyles}</style>
          <div className="mx-auto w-full max-w-[1440px] px-[22px]">
            <EntityField
              displayName="Heading"
              fieldId={props.heading.text.field}
              constantValueEnabled={props.heading.text.constantValueEnabled}
            >
              <h2
                className="font-[family:var(--fontFamily-h2-fontFamily)] text-center text-[28px] font-normal leading-[1.3] md:text-[36px]"
                style={getTextStyles(
                  props.heading.styles,
                  props.heading.fontColor,
                )}
              >
                {heading}
              </h2>
            </EntityField>
            <EntityField
              displayName="FAQs"
              fieldId={props.faqs.field}
              constantValueEnabled={props.faqs.constantValueEnabled}
            >
              <div className="mx-auto mt-8 grid max-w-[1068px] items-start gap-3 md:grid-cols-2">
                {faqColumns.map((column, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col gap-3">
                    {column.map(({ item, index }) => {
                      const question = item.question
                        ? resolveComponentData(
                            item.question,
                            locale,
                            streamDocument,
                            { output: "plainText" },
                          ) || ""
                        : "";
                      const answer = item.answer
                        ? resolveComponentData(
                            item.answer,
                            locale,
                            streamDocument,
                            {
                              richTextStyleOverrides:
                                answerRichTextStyleOverrides,
                            },
                          )
                        : undefined;
                      const isOpen = openIndexes.has(index);

                      return (
                        <div
                          key={`${question}-${index}`}
                          className="rounded-md"
                          style={{
                            backgroundColor: resolveThemeColorCssValue(
                              props.itemSurface.backgroundColor,
                            ),
                            color: `var(--colors-${itemForeground})`,
                          }}
                        >
                          <button
                            type="button"
                            className="font-[family:var(--fontFamily-body-fontFamily)] flex w-full items-center justify-between gap-4 px-[14px] py-[10px] text-left"
                            style={getTextStyles(
                              props.faqStyles.question.styles,
                              props.faqStyles.question.fontColor,
                            )}
                            onClick={() => toggleFaq(index)}
                          >
                            <span>{question}</span>
                            {isOpen ? (
                              <FaMinus className="h-3.5 w-3.5" />
                            ) : (
                              <FaPlus className="h-3.5 w-3.5" />
                            )}
                          </button>
                          {isOpen ? (
                            <div
                              className="font-[family:var(--fontFamily-body-fontFamily)] px-[14px] pb-3"
                              style={getTextStyles(
                                props.faqStyles.answer.styles,
                                props.faqStyles.answer.fontColor,
                              )}
                            >
                              {renderRichText(
                                answer,
                                answerRichTextStyleOverrides,
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </EntityField>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesFaqSection: YextComponentConfig<BusinessFinancialServicesFaqSectionProps> =
  {
    label: "FAQ Section",
    fields: BusinessFinancialServicesFaqSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Frequently Asked Questions",
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
      faqStyles: {
        question: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        answer: {
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
      faqs: faqsSource.defaultValue,
      itemSurface: {
        backgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
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
      <BusinessFinancialServicesFaqSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesFaqSection",
  displayName: "FAQ Section",
  description: "FAQ Section",
  pageSetTypes: ["ENTITY"],
};
