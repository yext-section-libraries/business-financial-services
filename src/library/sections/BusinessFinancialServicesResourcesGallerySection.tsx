import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  ComprehensiveCTA,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  Image,
  MaybeRTF,
  type ComprehensiveCTAValue,
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
  BackgroundProvider,
  isDarkColor,
} from "@yext/visual-editor";

const resourcesGalleryTypographyScopeClass = "bfs-resources-gallery-typography";
const resourcesGalleryTypographyStyles = `
  .${resourcesGalleryTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${resourcesGalleryTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${resourcesGalleryTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${resourcesGalleryTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${resourcesGalleryTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${resourcesGalleryTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${resourcesGalleryTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${resourcesGalleryTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${resourcesGalleryTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${resourcesGalleryTypographyScopeClass} a:not(.font-button-fontFamily):hover {
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
  imageConstrain: "fixed" | "filled";
};

export type BusinessFinancialServicesResourcesGallerySectionProps = {
  galleryImages: ImageField[];
  featureHeading: StyledTextField;
  featureBody: StyledRichTextField;
  featureCta: Partial<ComprehensiveCTAValue>;
  featureSurface: {
    backgroundColor: ThemeColor;
  };
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const resolveThemeColorCssValue = (value?: ThemeColor): string | undefined => {
  if (!value) return undefined;
  const color = value.selectedColor;
  if (color === "white") return "#ffffff";
  if (color.startsWith("[") && color.endsWith("]")) {
    return color.slice(1, -1);
  }
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

const imageDefault = (path: string): ImageField => ({
  image: {
    field: "",
    constantValue: {
      url: path,
      width: 1267,
      height: 1900,
    },
    constantValueEnabled: true,
  },
  imageConstrain: "filled",
});

const BusinessFinancialServicesResourcesGallerySectionFields: YextFields<BusinessFinancialServicesResourcesGallerySectionProps> =
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
    galleryImages: {
      label: "Gallery Images",
      type: "array",
      arrayFields: {
        image: {
          label: "Image",
          type: "entityField",
          filter: {
            types: ["type.image"],
          },
        },
        imageConstrain: {
          label: "Image Constrain",
          type: "select",
          options: [
            { label: "Fixed", value: "fixed" },
            { label: "Filled", value: "filled" },
          ],
        },
      },
      defaultItemProps: imageDefault(
        "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
      ),
      getItemSummary: (_, index = 0) => `Image ${index + 1}`,
    },
    featureHeading: {
      label: "Feature Heading",
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
    featureBody: {
      label: "Feature Body",
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
    featureCta: {
      label: "Feature Call to Action",
      type: "comprehensiveCTA",
    },
    featureSurface: {
      label: "Feature Surface",
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

export const BusinessFinancialServicesResourcesGallerySectionComponent: PuckComponent<
  BusinessFinancialServicesResourcesGallerySectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const heading =
    resolveComponentData(props.featureHeading.text, locale, streamDocument) ||
    "";
  const bodyRichTextStyleOverrides: RichTextStyleOverrides = {
    ...props.featureBody.styles,
    color:
      props.featureBody.fontColor ??
      props.featureSurface.backgroundColor.contrastingColor,
  };
  const body = resolveComponentData(
    props.featureBody.text,
    locale,
    streamDocument,
    { richTextStyleOverrides: bodyRichTextStyleOverrides },
  );
  const scopeName = `YextBusinessFinancialServicesResourcesGallerySection${getAnalyticsScopeHash(
    props.id,
  )}`;
  const renderGalleryImage = (index: number, className: string) => {
    const item = props.galleryImages[index];
    if (!item) return null;

    const image = resolveComponentData(item.image, locale, streamDocument);
    if (!image) return null;

    return (
      <EntityField
        displayName={`Gallery Image ${index + 1}`}
        fieldId={item.image.field}
        constantValueEnabled={item.image.constantValueEnabled}
      >
        <Image
          image={image}
          className={className}
          style={{
            objectFit: item.imageConstrain === "filled" ? "cover" : "contain",
            width: "100%",
          }}
        />
      </EntityField>
    );
  };

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <section
          className={`${resourcesGalleryTypographyScopeClass} overflow-hidden px-0 pb-5`}
          style={{
            backgroundColor: resolveThemeColorCssValue(
              props.section.backgroundColor,
            ),
          }}
        >
          <style>{resourcesGalleryTypographyStyles}</style>
          <div className="mx-auto grid w-full max-w-[1440px] gap-[10px] px-[22px] md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.58fr_1fr_1fr]">
            <div className="contents xl:grid xl:grid-rows-[minmax(0,345fr)_minmax(0,144fr)] xl:gap-[10px] xl:overflow-hidden xl:[contain:size]">
              {renderGalleryImage(
                0,
                "h-[345px] md:h-[244px] xl:h-full xl:min-h-0",
              )}
              {renderGalleryImage(
                1,
                "hidden h-[244px] md:block xl:h-full xl:min-h-0",
              )}
            </div>
            <div className="hidden md:contents xl:grid xl:grid-rows-2 xl:gap-[10px] xl:overflow-hidden xl:[contain:size]">
              {renderGalleryImage(2, "h-[244px] xl:h-full xl:min-h-0")}
              {renderGalleryImage(3, "h-[244px] xl:h-full xl:min-h-0")}
            </div>
            <div
              className="flex min-h-[340px] flex-col items-center justify-center px-7 py-10 text-center md:col-span-2 xl:col-span-1 xl:min-h-[500px]"
              style={{
                backgroundColor: resolveThemeColorCssValue(
                  props.featureSurface.backgroundColor,
                ),
                color: `var(--colors-${props.featureSurface.backgroundColor.contrastingColor})`,
              }}
            >
              <EntityField
                displayName="Feature Heading"
                fieldId={props.featureHeading.text.field}
                constantValueEnabled={
                  props.featureHeading.text.constantValueEnabled
                }
              >
                <h3
                  className="font-[family:var(--fontFamily-h3-fontFamily)] text-2xl font-medium leading-[1.3]"
                  style={getTextStyles(
                    props.featureHeading.styles,
                    props.featureHeading.fontColor,
                  )}
                >
                  {heading}
                </h3>
              </EntityField>
              <EntityField
                displayName="Feature Body"
                fieldId={props.featureBody.text.field}
                constantValueEnabled={
                  props.featureBody.text.constantValueEnabled
                }
              >
                <div
                  className="font-[family:var(--fontFamily-body-fontFamily)] my-8 text-base leading-[1.6]"
                  style={getTextStyles(
                    props.featureBody.styles,
                    props.featureBody.fontColor,
                  )}
                >
                  {renderRichText(body, bodyRichTextStyleOverrides)}
                </div>
              </EntityField>
              <BackgroundProvider
                value={{
                  selectedColor:
                    props.featureSurface.backgroundColor.selectedColor,
                  contrastingColor:
                    props.featureSurface.backgroundColor.contrastingColor,
                  isDarkColor: isDarkColor(
                    props.featureSurface.backgroundColor,
                  ),
                }}
              >
                <EntityField
                  displayName="Feature Call to Action"
                  fieldId={props.featureCta.data?.cta?.field}
                  constantValueEnabled={
                    props.featureCta.data?.cta?.constantValueEnabled
                  }
                >
                  <ComprehensiveCTA
                    value={props.featureCta as Partial<ComprehensiveCTAValue>}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[var(--colors-palette-quaternary)] px-[18px] py-2.5 no-underline"
                  />
                </EntityField>
              </BackgroundProvider>
            </div>
            <div className="hidden xl:grid xl:grid-rows-[minmax(0,345fr)_minmax(0,144fr)] xl:gap-[10px] xl:overflow-hidden xl:[contain:size]">
              {renderGalleryImage(4, "h-full min-h-0")}
              {renderGalleryImage(5, "h-full min-h-0")}
            </div>
            <div className="hidden xl:grid xl:grid-rows-2 xl:gap-[10px] xl:overflow-hidden xl:[contain:size]">
              {renderGalleryImage(6, "h-full min-h-0")}
              {renderGalleryImage(7, "h-full min-h-0")}
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesResourcesGallerySection: YextComponentConfig<BusinessFinancialServicesResourcesGallerySectionProps> =
  {
    label: "Resources Gallery Section",
    fields: BusinessFinancialServicesResourcesGallerySectionFields,
    defaultProps: {
      galleryImages: [
        imageDefault(
          "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
        ),
        imageDefault(
          "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
        ),
        imageDefault(
          "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
        ),
        imageDefault(
          "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
        ),
        imageDefault(
          "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
        ),
        imageDefault(
          "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
        ),
        imageDefault(
          "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
        ),
        imageDefault(
          "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
        ),
      ],
      featureHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Community & Client Resources",
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
      featureBody: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "[[name]] regularly hosts educational workshops and retirement planning events for [[address.city]]-area residents. Clients can also schedule appointments, review meeting details, and securely manage communications through the [[name]] client portal and mobile app.",
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
      featureCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "View Event Calendar",
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
        },
      },
      featureSurface: {
        backgroundColor: {
          selectedColor: "palette-secondary",
          contrastingColor: "palette-secondary-contrast",
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
      <BusinessFinancialServicesResourcesGallerySectionComponent
        {...props}
      />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesResourcesGallerySection",
  displayName: "Resources Gallery Section",
  description: "Resources Gallery Section",
  pageSetTypes: ["ENTITY"],
};
