import type { SectionConfig } from "@yext/visual-editor";
import { createScopedTypographyStyles } from "../shared/typography";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
  Image,
  type ComprehensiveCTAValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  resolveComponentData,
  useDocument,
  VisibilityWrapper,
  BackgroundProvider,
  isDarkColor,
} from "@yext/visual-editor";
import { getTextStyles, renderRichText } from "../shared/sectionStyles";
import type {
  StyledRichTextField,
  StyledTextField,
} from "../shared/sectionFields";

const resourcesGalleryTypographyScopeClass = "bfs-resources-gallery-typography";
const resourcesGalleryTypographyStyles = createScopedTypographyStyles(
  resourcesGalleryTypographyScopeClass,
);

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
  const bodyRichTextStyleOverrides = {
    ...props.featureBody.styles,
    color:
      props.featureBody.fontColor ??
      props.featureSurface.backgroundColor.contrastingColor,
  };
  const body = resolveComponentData(
    props.featureBody.text,
    locale,
    streamDocument,
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
        <Background
          as="section"
          background={props.section.backgroundColor}
          className={`${resourcesGalleryTypographyScopeClass} overflow-hidden px-0 pb-5`}
          style={getSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
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
              style={getSurfaceColorStyle(
                props.featureSurface.backgroundColor,
                streamDocument,
              )}
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
        </Background>
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
