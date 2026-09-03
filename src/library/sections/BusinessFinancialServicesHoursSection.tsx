import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, HoursTable } from "@yext/pages-components";
import {
  EntityField,
  getAnalyticsScopeHash,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  resolveComponentData,
  useDocument,
  VisibilityWrapper,
} from "@yext/visual-editor";

const hoursTypographyScopeClass = "bfs-hours-typography";
const hoursTypographyStyles = `
  .${hoursTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${hoursTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${hoursTypographyScopeClass} .HoursTable {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${hoursTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${hoursTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${hoursTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${hoursTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${hoursTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${hoursTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${hoursTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${hoursTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
`;
import type { DayOfWeekNames, HoursType } from "@yext/pages-components";

type StyledTextField = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type HoursTableStyles = {
  startOfWeek: keyof DayOfWeekNames | "today";
  collapseDays: boolean;
  showAdditionalHoursText: boolean;
  alignment: "items-start" | "items-center" | "items-end";
};

export type BusinessFinancialServicesHoursSectionProps = {
  heading: StyledTextField;
  lobbyHeading: StyledTextField;
  secondHoursHeading: StyledTextField;
  hours: YextEntityField<HoursType>;
  secondHours: YextEntityField<HoursType>;
  hoursStyles: HoursTableStyles;
  cardSurface: {
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

const BusinessFinancialServicesHoursSectionFields: YextFields<BusinessFinancialServicesHoursSectionProps> =
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
    lobbyHeading: {
      label: "Lobby Heading",
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
    secondHoursHeading: {
      label: "Second Hours Heading",
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
    hours: {
      type: "entityField",
      label: "Hours",
      filter: {
        types: ["type.hours"],
      },
      disableConstantValueToggle: true,
    },
    secondHours: {
      type: "entityField",
      label: "Second Hours",
      filter: {
        types: ["type.hours"],
      },
      disableConstantValueToggle: true,
    },
    hoursStyles: {
      label: "Hours Styles",
      type: "object",
      objectFields: {
        startOfWeek: {
          label: "Start Of Week",
          type: "select",
          options: [
            { label: "Monday", value: "monday" },
            { label: "Tuesday", value: "tuesday" },
            { label: "Wednesday", value: "wednesday" },
            { label: "Thursday", value: "thursday" },
            { label: "Friday", value: "friday" },
            { label: "Saturday", value: "saturday" },
            { label: "Sunday", value: "sunday" },
            { label: "Today", value: "today" },
          ],
        },
        collapseDays: {
          label: "Collapse Days",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        showAdditionalHoursText: {
          label: "Show Additional Hours Text",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        alignment: {
          label: "Alignment",
          type: "select",
          options: [
            { label: "Start", value: "items-start" },
            { label: "Center", value: "items-center" },
            { label: "End", value: "items-end" },
          ],
        },
      },
    },
  };

export const BusinessFinancialServicesHoursSectionComponent: PuckComponent<
  BusinessFinancialServicesHoursSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextBusinessFinancialServicesHoursSection${getAnalyticsScopeHash(
    props.id,
  )}`;
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const lobbyHeading =
    resolveComponentData(props.lobbyHeading.text, locale, streamDocument) || "";
  const secondHoursHeading =
    resolveComponentData(
      props.secondHoursHeading.text,
      locale,
      streamDocument,
    ) || "";
  const resolvedHours = resolveComponentData(
    props.hours,
    locale,
    streamDocument,
  );
  const resolvedSecondHours = resolveComponentData(
    props.secondHours,
    locale,
    streamDocument,
  );
  const additionalHoursText =
    typeof streamDocument.additionalHoursText === "string"
      ? streamDocument.additionalHoursText.trim()
      : "";
  const sectionForeground: ThemeColor = {
    selectedColor: props.section.backgroundColor.contrastingColor,
    contrastingColor: props.section.backgroundColor.selectedColor,
  };
  const cardForeground: ThemeColor = {
    selectedColor: props.cardSurface.backgroundColor.contrastingColor,
    contrastingColor: props.cardSurface.backgroundColor.selectedColor,
  };

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <section
          className={`${hoursTypographyScopeClass} px-0 py-[60px]`}
          style={{
            backgroundColor: resolveThemeColorCssValue(
              props.section.backgroundColor,
            ),
            color: resolveThemeColorCssValue(sectionForeground),
          }}
        >
          <style>{hoursTypographyStyles}</style>
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
                  props.heading.fontColor ?? sectionForeground,
                )}
              >
                {heading}
              </h2>
            </EntityField>
            <div className="mt-12 grid gap-5 md:grid-cols-2 md:justify-center">
              <article
                className="min-w-0 border border-current/10 px-6 py-8 md:px-10"
                style={{
                  backgroundColor: resolveThemeColorCssValue(
                    props.cardSurface.backgroundColor,
                  ),
                  color: resolveThemeColorCssValue(cardForeground),
                }}
              >
                <EntityField
                  displayName="Lobby Hours Heading"
                  fieldId={props.lobbyHeading.text.field}
                  constantValueEnabled={
                    props.lobbyHeading.text.constantValueEnabled
                  }
                >
                  <h3
                    className="font-[family:var(--fontFamily-h3-fontFamily)] text-center text-[26px] font-normal leading-[1.2]"
                    style={getTextStyles(
                      props.lobbyHeading.styles,
                      props.lobbyHeading.fontColor ?? cardForeground,
                    )}
                  >
                    {lobbyHeading}
                  </h3>
                </EntityField>
                <div
                  className={`mt-5 flex w-full min-w-0 flex-col ${props.hoursStyles.alignment}`}
                >
                  {resolvedHours ? (
                    <EntityField
                      displayName="Lobby Hours"
                      fieldId={props.hours.field}
                      constantValueEnabled={props.hours.constantValueEnabled}
                    >
                      <HoursTable
                        className="w-full max-w-full self-stretch [&_.HoursTable-row]:w-full [&_.HoursTable-row]:justify-between [&_.HoursTable-day]:flex-none [&_.HoursTable-day]:min-w-0 [&_.HoursTable-intervals]:flex-1 [&_.HoursTable-intervals]:min-w-0 [&_.HoursTable-intervals]:items-end [&_.HoursTable-intervals]:text-right"
                        hours={resolvedHours}
                        comingSoon={streamDocument.comingSoon}
                        startOfWeek={props.hoursStyles.startOfWeek}
                        collapseDays={props.hoursStyles.collapseDays}
                      />
                    </EntityField>
                  ) : null}
                  {props.hoursStyles.showAdditionalHoursText &&
                  additionalHoursText ? (
                    <span className="font-[family:var(--fontFamily-body-fontFamily)] mt-3 text-sm">
                      {additionalHoursText}
                    </span>
                  ) : null}
                </div>
              </article>
              <article
                className="min-w-0 border border-current/10 px-6 py-8 md:px-10"
                style={{
                  backgroundColor: resolveThemeColorCssValue(
                    props.cardSurface.backgroundColor,
                  ),
                  color: resolveThemeColorCssValue(cardForeground),
                }}
              >
                <EntityField
                  displayName="Second Hours Heading"
                  fieldId={props.secondHoursHeading.text.field}
                  constantValueEnabled={
                    props.secondHoursHeading.text.constantValueEnabled
                  }
                >
                  <h3
                    className="font-[family:var(--fontFamily-h3-fontFamily)] text-center text-[26px] font-normal leading-[1.2]"
                    style={getTextStyles(
                      props.secondHoursHeading.styles,
                      props.secondHoursHeading.fontColor ?? cardForeground,
                    )}
                  >
                    {secondHoursHeading}
                  </h3>
                </EntityField>
                <div className="mt-5 flex w-full min-w-0 flex-col">
                  {resolvedSecondHours ? (
                    <EntityField
                      displayName="Second Hours"
                      fieldId={props.secondHours.field}
                      constantValueEnabled={
                        props.secondHours.constantValueEnabled
                      }
                    >
                      <HoursTable
                        className="w-full max-w-full self-stretch [&_.HoursTable-row]:w-full [&_.HoursTable-row]:justify-between [&_.HoursTable-day]:flex-none [&_.HoursTable-day]:min-w-0 [&_.HoursTable-intervals]:flex-1 [&_.HoursTable-intervals]:min-w-0 [&_.HoursTable-intervals]:items-end [&_.HoursTable-intervals]:text-right"
                        hours={resolvedSecondHours}
                        comingSoon={streamDocument.comingSoon}
                        startOfWeek={props.hoursStyles.startOfWeek}
                        collapseDays={props.hoursStyles.collapseDays}
                      />
                    </EntityField>
                  ) : null}
                </div>
              </article>
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesHoursSection: YextComponentConfig<BusinessFinancialServicesHoursSectionProps> =
  {
    label: "Hours Section",
    fields: BusinessFinancialServicesHoursSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "[[address.city]] Hours",
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
      lobbyHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Lobby Hours",
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
      secondHoursHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "ATM Deposit Cut-off Hours",
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
      hours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      },
      secondHours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      },
      hoursStyles: {
        startOfWeek: "monday",
        collapseDays: false,
        showAdditionalHoursText: false,
        alignment: "items-start",
      },
      cardSurface: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
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
      <BusinessFinancialServicesHoursSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesHoursSection",
  displayName: "Hours Section",
  description: "Hours Section",
  pageSetTypes: ["ENTITY"],
};
