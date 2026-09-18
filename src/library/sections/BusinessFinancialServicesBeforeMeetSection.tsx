import type { SectionConfig } from "@yext/visual-editor";
import { createScopedTypographyStyles } from "../shared/typography";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  msg,
  Background,
  ComprehensiveCTA,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
  type ComprehensiveCTAValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextFields,
  resolveComponentData,
  useDocument,
  VisibilityWrapper,
} from "@yext/visual-editor";
import {
  getLocalizedString,
  type StyledRichTextField,
  type StyledTextField,
} from "../shared/sectionFields";
import {
  getTextStyles,
  renderRichText,
  type RichTextStyleOverrides,
} from "../shared/sectionStyles";

const beforeMeetTypographyScopeClass = "bfs-before-meet-typography";
const beforeMeetTypographyStyles = createScopedTypographyStyles(
  beforeMeetTypographyScopeClass,
);

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
    body: {
      label: msg("fields.body", "Body"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    pills: {
      label: msg("fields.pills", "Pills"),
      type: "array",
      arrayFields: {
        cta: {
          label: msg("fields.callToAction", "Call to Action"),
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
  const body = resolveComponentData(props.body.text, locale, streamDocument);
  const scopeName = `YextBusinessFinancialServicesBeforeMeetSection${getAnalyticsScopeHash(
    props.id,
  )}`;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <Background
          as="section"
          background={props.section.backgroundColor}
          className={`${beforeMeetTypographyScopeClass} px-0 py-[34px]`}
          style={getSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
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
        </Background>
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
