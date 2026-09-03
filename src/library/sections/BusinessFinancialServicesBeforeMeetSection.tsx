import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  ComprehensiveCTA,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  MaybeRTF,
  type ComprehensiveCTAValue,
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

const beforeMeetTypographyScopeClass = "bfs-before-meet-typography";
const beforeMeetTypographyStyles = `
  .${beforeMeetTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${beforeMeetTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${beforeMeetTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${beforeMeetTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${beforeMeetTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${beforeMeetTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${beforeMeetTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${beforeMeetTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${beforeMeetTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${beforeMeetTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
`;

type StyledTextField = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledRichTextField = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type PillAction = {
  cta: Partial<ComprehensiveCTAValue>;
};

export type BusinessFinancialServicesBeforeMeetSectionProps = {
  heading: StyledTextField;
  body: StyledRichTextField;
  pills: PillAction[];
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const resolveThemeColorCssValue = (value?: ThemeColor): string | undefined => {
  if (!value) return undefined;
  const color = value.selectedColor;
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
  color?: ThemeColor,
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

const getLocalizedString = (value?: TranslatableString): string =>
  typeof value === "string" ? value : (value?.defaultValue ?? "");

const pillDefault = (label: string): PillAction => ({
  cta: {
    data: {
      actionType: "link",
      cta: {
        field: "",
        constantValue: {
          label: { defaultValue: label, hasLocalizedValue: "true" },
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
});

const BusinessFinancialServicesBeforeMeetSectionFields: YextFields<BusinessFinancialServicesBeforeMeetSectionProps> =
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
    body: {
      label: "Body",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    pills: {
      label: "Pills",
      type: "array",
      arrayFields: {
        cta: {
          label: "Call to Action",
          type: "comprehensiveCTA",
        },
      },
      defaultItemProps: pillDefault("Action"),
      getItemSummary: (item) =>
        getLocalizedString(
          item.cta?.data?.cta?.constantValue?.label as
            TranslatableString | undefined,
        ) || "Action",
    },
  };

export const BusinessFinancialServicesBeforeMeetSectionComponent: PuckComponent<
  BusinessFinancialServicesBeforeMeetSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const bodyRichTextStyleOverrides: RichTextStyleOverrides = {
    ...props.body.styles,
    color:
      props.body.fontColor ?? props.section.backgroundColor.contrastingColor,
  };
  const body = resolveComponentData(props.body.text, locale, streamDocument, {
    richTextStyleOverrides: bodyRichTextStyleOverrides,
  });
  const scopeName = `YextBusinessFinancialServicesBeforeMeetSection${getAnalyticsScopeHash(
    props.id,
  )}`;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <section
          className={`${beforeMeetTypographyScopeClass} px-0 py-[34px]`}
          style={{
            backgroundColor: resolveThemeColorCssValue(
              props.section.backgroundColor,
            ),
            color: `var(--colors-${props.section.backgroundColor.contrastingColor})`,
          }}
        >
          <style>{beforeMeetTypographyStyles}</style>
          <div className="mx-auto max-w-[902px] px-[22px] text-center">
            <EntityField
              displayName="Heading"
              fieldId={props.heading.text.field}
              constantValueEnabled={props.heading.text.constantValueEnabled}
            >
              <h2
                className="font-[family:var(--fontFamily-h2-fontFamily)] text-[28px] font-normal leading-[1.3] md:text-[36px]"
                style={getTextStyles(
                  props.heading.styles,
                  props.heading.fontColor,
                )}
              >
                {heading}
              </h2>
            </EntityField>
            <EntityField
              displayName="Body"
              fieldId={props.body.text.field}
              constantValueEnabled={props.body.text.constantValueEnabled}
            >
              <div
                className="font-[family:var(--fontFamily-body-fontFamily)] mx-auto mt-2 max-w-[690px] text-base leading-[1.6]"
                style={getTextStyles(props.body.styles, props.body.fontColor)}
              >
                {renderRichText(body, bodyRichTextStyleOverrides)}
              </div>
            </EntityField>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {props.pills.map((item, index) => (
                <EntityField
                  key={index}
                  displayName={`Disclosure Link ${index + 1}`}
                  fieldId={item.cta.data?.cta?.field}
                  constantValueEnabled={
                    item.cta.data?.cta?.constantValueEnabled
                  }
                >
                  <ComprehensiveCTA
                    value={item.cta as Partial<ComprehensiveCTAValue>}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full px-[18px] py-2.5 no-underline"
                  />
                </EntityField>
              ))}
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesBeforeMeetSection: YextComponentConfig<BusinessFinancialServicesBeforeMeetSectionProps> =
  {
    label: "Disclosures Section",
    fields: BusinessFinancialServicesBeforeMeetSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Before You Meet With Us...",
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
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Prospective clients can review advisor credentials, disclosures, and service information before scheduling a consultation. Advisory regulatory and other key disclosures can be found through the links below.",
            ),
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
      pills: [
        pillDefault("Advisory Disclosures"),
        pillDefault("Regulatory Information"),
        pillDefault("Privacy Policy"),
        pillDefault("FINRA BrokerCheck"),
      ],
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        visibleOnLivePage: true,
      },
    },
    render: (props) => (
      <BusinessFinancialServicesBeforeMeetSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesBeforeMeetSection",
  displayName: "Disclosures Section",
  description: "Disclosures Section",
  pageSetTypes: ["ENTITY"],
};
