import type { SectionConfig } from "@yext/visual-editor";
import { createScopedTypographyStyles } from "../shared/typography";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  getDirections,
  Link,
} from "@yext/pages-components";
import {
  Background,
  EntityField,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  mergeMeta,
  resolveUrlTemplate,
  type StyledTextValue,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
  getPreferredDistanceUnit,
  resolveComponentData,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  VisibilityWrapper,
  getThemeColorCssValue as resolveThemeColorCssValue,
} from "@yext/visual-editor";
import type { StreamDocument } from "@yext/visual-editor";
import { getTextStyles } from "../shared/sectionStyles";
import type { StyledTextField } from "../shared/sectionFields";

const nearbyLocationsTypographyScopeClass = "bfs-nearby-locations-typography";
const nearbyLocationsTypographyStyles = createScopedTypographyStyles(
  nearbyLocationsTypographyScopeClass,
);

type CardCtaStyle = "solid" | "outline" | "link";

export type BusinessFinancialServicesNearbyLocationsSectionProps = {
  heading: StyledTextField;
  radius: number;
  limit: number;
  cardSurface: {
    backgroundColor: ThemeColor;
    textStyles: StyledTextValue;
    fontColor?: ThemeColor;
    ctaStyle: CardCtaStyle;
    ctaColor?: ThemeColor;
  };
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const getContrastingThemeColor = (backgroundColor: ThemeColor): ThemeColor => ({
  selectedColor: backgroundColor.contrastingColor,
  contrastingColor: backgroundColor.selectedColor,
});

const getCtaStyles = (
  ctaStyle: CardCtaStyle,
  ctaColor: ThemeColor | undefined,
  defaultColor: ThemeColor,
  textStyles: React.CSSProperties,
): React.CSSProperties => {
  const resolvedCtaColor = ctaColor ?? defaultColor;
  const color = resolveThemeColorCssValue(resolvedCtaColor);

  if (ctaStyle === "solid") {
    return {
      ...textStyles,
      backgroundColor: color,
      borderColor: color,
      color: resolveThemeColorCssValue(
        getContrastingThemeColor(resolvedCtaColor),
      ),
    };
  }

  return {
    ...textStyles,
    backgroundColor: "transparent",
    borderColor: ctaStyle === "outline" ? color : "transparent",
    color,
  };
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const getDistanceLabel = (
  origin?: { latitude?: number; longitude?: number },
  target?: { latitude?: number; longitude?: number },
  locale?: string,
) => {
  if (
    origin?.latitude === undefined ||
    origin.longitude === undefined ||
    target?.latitude === undefined ||
    target.longitude === undefined
  ) {
    return "";
  }

  const earthRadiusMi = 3958.8;
  const dLat = toRadians(target.latitude - origin.latitude);
  const dLon = toRadians(target.longitude - origin.longitude);
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(target.latitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const miles = earthRadiusMi * c;
  const preferredUnit = getPreferredDistanceUnit(locale ?? "en");

  if (preferredUnit === "kilometer") {
    return `${(miles * 1.60934).toFixed(1)} km away`;
  }

  return `${miles.toFixed(1)} miles away`;
};

const BusinessFinancialServicesNearbyLocationsSectionFields: YextFields<BusinessFinancialServicesNearbyLocationsSectionProps> =
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
        textStyles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        ctaStyle: {
          label: "CTA Style",
          type: "radio",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Outline", value: "outline" },
            { label: "Link", value: "link" },
          ],
        },
        ctaColor: {
          label: "CTA Color",
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
    radius: {
      label: "Radius",
      type: "number",
    },
    limit: {
      label: "Limit",
      type: "number",
    },
  };

export const BusinessFinancialServicesNearbyLocationsSectionComponent: PuckComponent<
  BusinessFinancialServicesNearbyLocationsSectionProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument.locale ?? "en";
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const coordinate = streamDocument.yextDisplayCoordinate;
  const enableNearbyLocations =
    coordinate?.latitude !== undefined &&
    coordinate?.longitude !== undefined &&
    Boolean(props.radius) &&
    Boolean(props.limit);
  const { data, status } = useNearbyLocations({
    streamDocument,
    latitude: coordinate?.latitude,
    longitude: coordinate?.longitude,
    radiusMi: props.radius,
    limit: props.limit,
    enabled: enableNearbyLocations,
  });
  const nearbyLocationDocs = data?.response?.docs ?? [];
  const nearbyLocationCards = nearbyLocationDocs.map((locationData) => {
    const mergedDocument = mergeMeta(locationData, streamDocument);
    const resolvedUrl = resolveUrlTemplate(
      mergedDocument,
      relativePrefixToRoot ?? "",
    );
    const resolvedCoordinate =
      locationData.yextDisplayCoordinate ?? locationData.geocodedCoordinate;
    const directionsUrl = getDirections(locationData.address);

    return {
      locationData,
      resolvedUrl,
      directionsUrl,
      distanceLabel: getDistanceLabel(coordinate, resolvedCoordinate, locale),
    };
  });
  const scopeName = `YextBusinessFinancialServicesNearbyLocationsSection${getAnalyticsScopeHash(
    props.id,
  )}`;
  const cardForeground = getContrastingThemeColor(
    props.cardSurface.backgroundColor,
  );
  const cardTextStyles = getTextStyles(
    props.cardSurface.textStyles,
    props.cardSurface.fontColor ?? cardForeground,
  );
  const ctaStyles = getCtaStyles(
    props.cardSurface.ctaStyle,
    props.cardSurface.ctaColor,
    cardForeground,
    cardTextStyles,
  );
  const ctaClassName =
    props.cardSurface.ctaStyle === "link"
      ? "inline-flex items-center justify-center no-underline hover:underline"
      : "inline-flex min-h-[42px] items-center justify-center rounded-full border px-[18px] py-2.5 no-underline hover:underline";

  if (!enableNearbyLocations) {
    return <></>;
  }

  if (status === "pending") {
    return (
      <section
        className={`${nearbyLocationsTypographyScopeClass} px-0 py-[60px]`}
      >
        <style>{nearbyLocationsTypographyStyles}</style>
        <div className="mx-auto w-full max-w-[1440px] px-[22px]">
          <EntityField
            displayName="Heading"
            fieldId={props.heading.text.field}
            constantValueEnabled={props.heading.text.constantValueEnabled}
          >
            <h2 className="text-center text-[28px] font-normal leading-[1.3] md:text-[36px]">
              {heading}
            </h2>
          </EntityField>
          <p className="font-[family:var(--fontFamily-body-fontFamily)] mt-4 text-center">
            Loading nearby locations
          </p>
        </div>
      </section>
    );
  }

  if (status !== "success" || !nearbyLocationCards.length) {
    if (!props.puck.isEditing) {
      return <></>;
    }

    return (
      <section
        className={`${nearbyLocationsTypographyScopeClass} px-0 py-[60px]`}
      >
        <style>{nearbyLocationsTypographyStyles}</style>
        <div className="mx-auto w-full max-w-[1440px] px-[22px]">
          <EntityField
            displayName="Heading"
            fieldId={props.heading.text.field}
            constantValueEnabled={props.heading.text.constantValueEnabled}
          >
            <h2 className="text-center text-[28px] font-normal leading-[1.3] md:text-[36px]">
              {heading}
            </h2>
          </EntityField>
          <p className="font-[family:var(--fontFamily-body-fontFamily)] mt-4 text-center">
            No nearby locations found for this location
          </p>
        </div>
      </section>
    );
  }

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <Background
          as="section"
          background={props.section.backgroundColor}
          className={`${nearbyLocationsTypographyScopeClass} px-0 py-[60px]`}
          style={getSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
        >
          <style>{nearbyLocationsTypographyStyles}</style>
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
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {nearbyLocationCards.map(
                (
                  { locationData, resolvedUrl, directionsUrl, distanceLabel },
                  index,
                ) => {
                  const name = locationData.name ?? "Nearby Location";

                  return (
                    <article
                      key={locationData.id ?? name}
                      className="flex min-h-[184px] flex-col border border-current/10 p-[10px]"
                      style={{
                        ...getSurfaceColorStyle(
                          props.cardSurface.backgroundColor,
                          streamDocument,
                        ),
                        ...cardTextStyles,
                      }}
                    >
                      <Link
                        cta={{ link: resolvedUrl, linkType: "URL" }}
                        eventName={`nearbyLocation${index}`}
                        className="font-[family:var(--fontFamily-link-fontFamily)] text-lg font-semibold leading-[1.4] no-underline"
                        style={cardTextStyles}
                      >
                        {name}
                      </Link>
                      {distanceLabel ? (
                        <p
                          className="font-[family:var(--fontFamily-body-fontFamily)] mb-1.5 mt-1 text-base leading-6"
                          style={cardTextStyles}
                        >
                          {distanceLabel}
                        </p>
                      ) : null}
                      <p
                        className="font-[family:var(--fontFamily-body-fontFamily)] m-0 text-base leading-6"
                        style={cardTextStyles}
                      >
                        {locationData.address?.line1}
                        <br />
                        {[
                          locationData.address?.city,
                          locationData.address?.region,
                          locationData.address?.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {directionsUrl ? (
                        <div className="mt-auto pt-4">
                          <Link
                            cta={{ link: directionsUrl, linkType: "URL" }}
                            eventName={`nearbyLocation-${index}-getDirections`}
                            className={ctaClassName}
                            style={ctaStyles}
                          >
                            Get Directions
                          </Link>
                        </div>
                      ) : null}
                    </article>
                  );
                },
              )}
            </div>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesNearbyLocationsSection: YextComponentConfig<BusinessFinancialServicesNearbyLocationsSectionProps> =
  {
    label: "Nearby Locations Section",
    fields: BusinessFinancialServicesNearbyLocationsSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Nearby Locations and ATMs",
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
      radius: 10,
      limit: 4,
      cardSurface: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        textStyles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
        ctaStyle: "solid",
        ctaColor: undefined,
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
      <BusinessFinancialServicesNearbyLocationsSectionComponent
        {...props}
      />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesNearbyLocationsSection",
  displayName: "Nearby Locations Section",
  description: "Nearby Locations Section",
  pageSetTypes: ["ENTITY"],
};
