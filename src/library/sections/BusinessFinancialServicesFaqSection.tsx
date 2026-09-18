import type { SectionConfig } from "@yext/visual-editor";
import { createScopedTypographyStyles } from "../shared/typography";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, useAnalytics } from "@yext/pages-components";
import {
  msg,
  Background,
  createItemSource,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
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
import {
  getTextStyles,
  renderRichText,
  type RichTextStyleOverrides,
} from "../shared/sectionStyles";
import type {
  StyledTextField,
  StyledTextStyles,
} from "../shared/sectionFields";

const faqTypographyScopeClass = "bfs-faq-typography";
const faqTypographyStyles = createScopedTypographyStyles(
  faqTypographyScopeClass,
  ["button"],
);
import { FaPlus, FaMinus } from "react-icons/fa";

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
  label: msg("fields.faqs", "FAQs"),
  mappingFields: {
    question: {
      label: msg("fields.question", "Question"),
      type: "entityField",
      filter: { types: ["type.string", "type.rich_text_v2"] },
    },
    answer: {
      label: msg("fields.answer", "Answer"),
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
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    heading: {
      label: msg("fields.heading", "Heading"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: { types: ["type.string"] },
        },
        styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    faqStyles: {
      label: msg("fields.faqStyles", "FAQ Styles"),
      type: "object",
      objectFields: {
        question: {
          label: msg("fields.question", "Question"),
          type: "object",
          objectFields: {
            styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        answer: {
          label: msg("fields.answer", "Answer"),
          type: "object",
          objectFields: {
            styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
    faqs: faqsSource.field,
    itemSurface: {
      label: msg("fields.itemSurface", "Item Surface"),
      type: "object",
      objectFields: {
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
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
        <Background
          as="section"
          background={props.section.backgroundColor}
          className={`${faqTypographyScopeClass} px-0 py-[60px]`}
          style={getSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
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
                          )
                        : undefined;
                      const isOpen = openIndexes.has(index);

                      return (
                        <div
                          key={`${question}-${index}`}
                          className="rounded-md"
                          style={getSurfaceColorStyle(
                            props.itemSurface.backgroundColor,
                            streamDocument,
                          )}
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
        </Background>
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
