import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  EntityField,
  getAnalyticsScopeHash,
  Image,
  MaybeRTF,
  type RichText,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  resolveComponentData,
  useDocument,
  VisibilityWrapper,
} from "@yext/visual-editor";

const aboutTypographyScopeClass = "bfs-about-typography";
const aboutTypographyStyles = `
  .${aboutTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${aboutTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${aboutTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${aboutTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${aboutTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${aboutTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${aboutTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${aboutTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${aboutTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${aboutTypographyScopeClass} a:not(.font-button-fontFamily):hover {
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

type ImageField = {
  image: YextEntityField<TranslatableAssetImage>;
};

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

const resolveThemeColorCssValue = (value?: ThemeColor): string | undefined => {
  if (!value) {
    return undefined;
  }

  const color = value.selectedColor;
  if (color.startsWith("[") && color.endsWith("]")) {
    return color.slice(1, -1);
  }
  if (color === "white") {
    return "#ffffff";
  }
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
  const body = resolveComponentData(props.body.text, locale, streamDocument, {
    richTextStyleOverrides: bodyRichTextStyleOverrides,
  });

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
                {React.isValidElement(body) ? (
                  body
                ) : (
                  <MaybeRTF
                    data={body as string | RichText | undefined}
                    richTextStyleOverrides={bodyRichTextStyleOverrides}
                  />
                )}
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
