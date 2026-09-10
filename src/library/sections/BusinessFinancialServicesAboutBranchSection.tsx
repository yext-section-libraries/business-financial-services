import type { SectionConfig } from "@yext/visual-editor";
import { createScopedTypographyStyles } from "../shared/typography";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  EntityField,
  getAnalyticsScopeHash,
  Image,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
  resolveComponentData,
  useDocument,
  VisibilityWrapper,
  getThemeColorCssValue as resolveThemeColorCssValue,
} from "@yext/visual-editor";
import { getTextStyles, renderRichText } from "../shared/sectionStyles";
import type {
  ImageField,
  StyledRichTextField,
  StyledTextField,
} from "../shared/sectionFields";

const aboutTypographyScopeClass = "bfs-about-typography";
const aboutTypographyStyles = createScopedTypographyStyles(
  aboutTypographyScopeClass,
);

export type BusinessFinancialServicesAboutBranchSectionProps = {
  backgroundImage: ImageField;
  heading: StyledTextField;
  body: StyledRichTextField;
  section: {
    visibleOnLivePage: boolean;
  };
  overlay: {
    backgroundColor: ThemeColor;
  };
};

const BusinessFinancialServicesAboutBranchSectionFields: YextFields<BusinessFinancialServicesAboutBranchSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
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
    overlay: {
      label: "Overlay",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    backgroundImage: {
      label: "Background Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: {
            types: ["type.image"],
          },
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
  };

export const BusinessFinancialServicesAboutBranchSectionComponent: PuckComponent<
  BusinessFinancialServicesAboutBranchSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextBusinessFinancialServicesAboutBranchSection${getAnalyticsScopeHash(
    props.id,
  )}`;
  const image = resolveComponentData(
    props.backgroundImage.image,
    locale,
    streamDocument,
  );
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const bodyRichTextStyleOverrides = {
    ...props.body.styles,
    color:
      props.body.fontColor ??
      resolveThemeColorCssValue({
        selectedColor: props.overlay.backgroundColor.contrastingColor,
        contrastingColor: props.overlay.backgroundColor.selectedColor,
      }),
  };
  const body = resolveComponentData(props.body.text, locale, streamDocument);

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <section
          className={`${aboutTypographyScopeClass} relative overflow-hidden`}
          style={{
            color: resolveThemeColorCssValue({
              selectedColor: props.overlay.backgroundColor.contrastingColor,
              contrastingColor: props.overlay.backgroundColor.selectedColor,
            }),
          }}
        >
          <style>{aboutTypographyStyles}</style>
          {image ? (
            <div className="absolute inset-0 h-full w-full">
              <EntityField
                displayName="Background Image"
                fieldId={props.backgroundImage.image.field}
                constantValueEnabled={
                  props.backgroundImage.image.constantValueEnabled
                }
              >
                <Image
                  image={image}
                  className="h-full w-full"
                  style={{
                    display: "block",
                    height: "100%",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              </EntityField>
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: resolveThemeColorCssValue(
                    props.overlay.backgroundColor,
                  ),
                  opacity: 0.55,
                }}
              />
            </div>
          ) : null}
          <div className="relative z-10 mx-auto flex min-h-[672px] w-full max-w-[1098px] flex-col items-center justify-center px-[22px] py-16 text-center">
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
                  props.overlay.backgroundColor.contrastingColor,
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
              <div className="font-[family:var(--fontFamily-body-fontFamily)] mt-4 space-y-4 text-base leading-[1.7]">
                {renderRichText(body, bodyRichTextStyleOverrides)}
              </div>
            </EntityField>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesAboutBranchSection: YextComponentConfig<BusinessFinancialServicesAboutBranchSectionProps> =
  {
    label: "About Branch Section",
    fields: BusinessFinancialServicesAboutBranchSectionFields,
    defaultProps: {
      backgroundImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "About This Branch",
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
            defaultValue: {
              json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"[[name]] - [[address.city]] is located in the [[geomodifier]] district near [[address.city]] and supports clients across [[address.region]] and surrounding communities. The office provides in-person and virtual financial planning conversations for individuals, families, retirees, and business owners looking for guidance around long-term financial goals.\\n","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"\\nClients commonly visit this location for retirement planning, portfolio reviews, investment guidance, and broader financial planning conversations. Advisors at this branch support both ongoing wealth management relationships and one-time planning discussions depending on client needs.\\n","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"\\nThe office includes private consultation rooms, multilingual support, and online scheduling for added flexibility. Saturday hours are available for select appointment types.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
              html: '<p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>[[name]] - [[address.city]] is located in the [[geomodifier]] district near [[address.city]] and supports clients across [[address.region]] and surrounding communities. The office provides in-person and virtual financial planning conversations for individuals, families, retirees, and business owners looking for guidance around long-term financial goals.\n</span></p><p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>\nClients commonly visit this location for retirement planning, portfolio reviews, investment guidance, and broader financial planning conversations. Advisors at this branch support both ongoing wealth management relationships and one-time planning discussions depending on client needs.\n</span></p><p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>\nThe office includes private consultation rooms, multilingual support, and online scheduling for added flexibility. Saturday hours are available for select appointment types.</span></p>',
            },
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
      overlay: {
        backgroundColor: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
      },
      section: {
        visibleOnLivePage: true,
      },
    },
    render: (props) => (
      <BusinessFinancialServicesAboutBranchSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesAboutBranchSection",
  displayName: "About Branch Section",
  description: "About Branch Section",
  pageSetTypes: ["ENTITY"],
};
