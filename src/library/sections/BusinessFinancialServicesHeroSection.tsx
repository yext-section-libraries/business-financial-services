import type { SectionConfig } from "@yext/visual-editor";
import { createScopedTypographyStyles } from "../shared/typography";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  ComprehensiveCTA,
  EntityField,
  getAnalyticsScopeHash,
  getAggregateRating,
  getDefaultRTF,
  Image,
  ReviewStars,
  type ComprehensiveCTAValue,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
  resolveComponentData,
  useDocument,
  VisibilityWrapper,
  BackgroundProvider,
  isDarkColor,
  getThemeColorCssValue as resolveThemeColorCssValue,
} from "@yext/visual-editor";
import { getTextStyles, renderRichText } from "../shared/sectionStyles";
import type {
  ImageField,
  StyledRichTextField,
  StyledTextField,
} from "../shared/sectionFields";

const heroTypographyScopeClass = "bfs-hero-typography";
const heroTypographyStyles = createScopedTypographyStyles(
  heroTypographyScopeClass,
);

export type BusinessFinancialServicesHeroSectionProps = {
  backgroundImage: ImageField;
  geomodifier: StyledTextField;
  heading: StyledTextField;
  body: StyledRichTextField;
  primaryCta: Partial<ComprehensiveCTAValue>;
  secondaryCta: Partial<ComprehensiveCTAValue>;
  section: {
    visibleOnLivePage: boolean;
  };
  overlay: {
    backgroundColor: ThemeColor;
  };
};

const BusinessFinancialServicesHeroSectionFields: YextFields<BusinessFinancialServicesHeroSectionProps> =
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
    geomodifier: {
      label: "Geomodifier",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
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
          filter: {
            types: ["type.string"],
          },
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
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    primaryCta: {
      label: "Primary Call to Action",
      type: "comprehensiveCTA",
    },
    secondaryCta: {
      label: "Secondary Call to Action",
      type: "comprehensiveCTA",
    },
  };

export const BusinessFinancialServicesHeroSectionComponent: PuckComponent<
  BusinessFinancialServicesHeroSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";

  const scopeName = `YextBusinessFinancialServicesHeroSection${getAnalyticsScopeHash(
    props.id,
  )}`;
  const resolvedImage = resolveComponentData(
    props.backgroundImage.image,
    locale,
    streamDocument,
  );
  const resolvedGeomodifier =
    resolveComponentData(props.geomodifier.text, locale, streamDocument) || "";
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const bodyRichTextStyleOverrides = {
    ...props.body.styles,
    color:
      props.body.fontColor ?? props.overlay.backgroundColor.contrastingColor,
  };
  const resolvedBody = resolveComponentData(
    props.body.text,
    locale,
    streamDocument,
  );
  const aggregateRating = getAggregateRating(streamDocument);
  const reviewInfo = aggregateRating
    ? `${aggregateRating.averageRating} stars from ${aggregateRating.reviewCount} client reviews`
    : "";

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <section
          className={`${heroTypographyScopeClass} relative overflow-hidden`}
          style={{
            color: resolveThemeColorCssValue({
              selectedColor: props.overlay.backgroundColor.contrastingColor,
              contrastingColor: props.overlay.backgroundColor.selectedColor,
            }),
          }}
        >
          <style>{heroTypographyStyles}</style>
          {resolvedImage ? (
            <div className="absolute inset-0">
              <EntityField
                displayName="Background Image"
                fieldId={props.backgroundImage.image.field}
                constantValueEnabled={
                  props.backgroundImage.image.constantValueEnabled
                }
              >
                <Image
                  image={resolvedImage}
                  className={"h-full w-full object-cover"}
                  style={{
                    display: "block",
                    height: "100%",
                    objectPosition: "50% 0%",
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
                  opacity: 0.58,
                }}
              />
            </div>
          ) : null}
          <div className="relative z-10 mx-auto flex min-h-[600px] w-full max-w-[1440px] flex-col justify-center px-[22px] py-20 lg:px-20">
            {aggregateRating.averageRating && aggregateRating.reviewCount ? (
              <div className="flex flex-wrap items-center gap-1 pt-4">
                <ReviewStars
                  averageRating={aggregateRating.averageRating}
                  color={
                    isDarkColor(props.overlay.backgroundColor)
                      ? { selectedColor: "white", contrastingColor: "black" }
                      : {
                          selectedColor: "palette-primary",
                          contrastingColor: "palette-primary-contrast",
                        }
                  }
                />
                <span className="font-[family:var(--fontFamily-body-fontFamily)] basis-full text-sm leading-6 md:basis-auto md:text-base">
                  {reviewInfo}
                </span>
              </div>
            ) : null}
            <EntityField
              displayName="Geomodifier"
              fieldId={props.geomodifier.text.field}
              constantValueEnabled={props.geomodifier.text.constantValueEnabled}
            >
              <p
                className="font-[family:var(--fontFamily-body-fontFamily)] mt-2 text-[28px] font-normal leading-[1.2] md:text-[36px] md:leading-[45px]"
                style={getTextStyles(
                  props.geomodifier.styles,
                  props.geomodifier.fontColor,
                )}
              >
                {resolvedGeomodifier}
              </p>
            </EntityField>
            <EntityField
              displayName="Heading"
              fieldId={props.heading.text.field}
              constantValueEnabled={props.heading.text.constantValueEnabled}
            >
              <h1
                className="font-[family:var(--fontFamily-h1-fontFamily)] max-w-[620px] text-[40px] font-bold leading-[1.1] md:text-[50px]"
                style={getTextStyles(
                  props.heading.styles,
                  props.heading.fontColor,
                  props.overlay.backgroundColor.contrastingColor,
                )}
              >
                {resolvedHeading}
              </h1>
            </EntityField>
            <EntityField
              displayName="Body"
              fieldId={props.body.text.field}
              constantValueEnabled={props.body.text.constantValueEnabled}
            >
              <div
                className="font-[family:var(--fontFamily-body-fontFamily)] mt-5 max-w-[620px] text-base leading-[1.7]"
                style={getTextStyles(props.body.styles, props.body.fontColor)}
              >
                {renderRichText(resolvedBody, bodyRichTextStyleOverrides)}
              </div>
            </EntityField>
            <BackgroundProvider
              value={{
                ...props.overlay.backgroundColor,
                isDarkColor: isDarkColor(props.overlay.backgroundColor),
              }}
            >
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <EntityField
                  displayName="Primary Call to Action"
                  fieldId={props.primaryCta.data?.cta?.field}
                  constantValueEnabled={
                    props.primaryCta.data?.cta?.constantValueEnabled
                  }
                >
                  <ComprehensiveCTA
                    value={props.primaryCta as Partial<ComprehensiveCTAValue>}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full px-8 py-3 no-underline"
                  />
                </EntityField>
                <EntityField
                  displayName="Secondary Call to Action"
                  fieldId={props.secondaryCta.data?.cta?.field}
                  constantValueEnabled={
                    props.secondaryCta.data?.cta?.constantValueEnabled
                  }
                >
                  <ComprehensiveCTA
                    value={props.secondaryCta as Partial<ComprehensiveCTAValue>}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full px-8 py-3 no-underline"
                  />
                </EntityField>
              </div>
            </BackgroundProvider>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesHeroSection: YextComponentConfig<BusinessFinancialServicesHeroSectionProps> =
  {
    label: "Hero Section",
    fields: BusinessFinancialServicesHeroSectionFields,
    defaultProps: {
      backgroundImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg",
            width: 1900,
            height: 1267,
          },
          constantValueEnabled: true,
        },
      },
      geomodifier: {
        text: {
          field: "geomodifier",
          constantValue: { defaultValue: "", hasLocalizedValue: "true" },
          constantValueEnabled: false,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: {
          selectedColor: "palette-secondary",
          contrastingColor: "palette-secondary-contrast",
        },
      },
      heading: {
        text: {
          field: "name",
          constantValue: { defaultValue: "", hasLocalizedValue: "true" },
          constantValueEnabled: false,
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
              "Providing wealth management, retirement planning, and financial advisory services for individuals, families, and business owners across the [[address.city]] metro area.",
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
      primaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "Schedule Consultation",
                hasLocalizedValue: "true",
              },
              link: { defaultValue: "#services", hasLocalizedValue: "true" },
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
      secondaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "Get Directions",
                hasLocalizedValue: "true",
              },
              link: {
                defaultValue: "",
                hasLocalizedValue: "true",
              },
              linkType: "URL",
              ctaType: "getDirections",
            },
            constantValueEnabled: true,
            selectedType: "getDirections",
          },
          openInNewTab: true,
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
      section: {
        visibleOnLivePage: true,
      },
      overlay: {
        backgroundColor: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
      },
    },
    render: (props) => (
      <BusinessFinancialServicesHeroSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesHeroSection",
  displayName: "Hero Section",
  description: "Hero Section",
  pageSetTypes: ["ENTITY"],
};
