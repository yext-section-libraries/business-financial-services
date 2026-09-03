import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  getDirections,
  Link,
} from "@yext/pages-components";
import {
  EntityField,
  getAnalyticsScopeHash,
  mergeMeta,
  resolveUrlTemplate,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  getPreferredDistanceUnit,
  resolveComponentData,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  VisibilityWrapper,
} from "@yext/visual-editor";
import type { StreamDocument } from "@yext/visual-editor";

const nearbyLocationsTypographyScopeClass = "bfs-nearby-locations-typography";
const nearbyLocationsTypographyStyles = `
  .${nearbyLocationsTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${nearbyLocationsTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${nearbyLocationsTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${nearbyLocationsTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${nearbyLocationsTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${nearbyLocationsTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${nearbyLocationsTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${nearbyLocationsTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${nearbyLocationsTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${nearbyLocationsTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
`;

type StyledTextField = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

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

const getContrastingThemeColor = (backgroundColor: ThemeColor): ThemeColor => ({
  selectedColor: backgroundColor.contrastingColor,
  contrastingColor: backgroundColor.selectedColor,
});

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
        <section
          className={`${nearbyLocationsTypographyScopeClass} px-0 py-[60px]`}
          style={{
            backgroundColor: resolveThemeColorCssValue(
              props.section.backgroundColor,
            ),
            color: `var(--colors-${props.section.backgroundColor.contrastingColor})`,
          }}
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
                        ...cardTextStyles,
                        backgroundColor: resolveThemeColorCssValue(
                          props.cardSurface.backgroundColor,
                        ),
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
        </section>
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
