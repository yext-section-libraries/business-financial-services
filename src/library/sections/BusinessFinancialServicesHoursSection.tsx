import type { SectionConfig } from "@yext/visual-editor";
import { createScopedTypographyStyles } from "../shared/typography";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  HoursTable,
  type HoursTableIntervalTranslations,
} from "@yext/pages-components";
import { useTranslation } from "react-i18next";
import {
  msg,
  Background,
  EntityField,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  type ThemeColor,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  resolveComponentData,
  useDocument,
  VisibilityWrapper,
} from "@yext/visual-editor";
import { getTextStyles } from "../shared/sectionStyles";
import type { StyledTextField } from "../shared/sectionFields";

const hoursTypographyScopeClass = "bfs-hours-typography";
const hoursTypographyStyles = createScopedTypographyStyles(
  hoursTypographyScopeClass,
  [".HoursTable"],
);
import type { DayOfWeekNames, HoursType } from "@yext/pages-components";

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

const BusinessFinancialServicesHoursSectionFields: YextFields<BusinessFinancialServicesHoursSectionProps> =
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
    cardSurface: {
      label: msg("fields.cardSurface", "Card Surface"),
      type: "object",
      objectFields: {
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
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
    lobbyHeading: {
      label: msg("fields.lobbyHeading", "Lobby Heading"),
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
    secondHoursHeading: {
      label: msg("fields.secondHoursHeading", "Second Hours Heading"),
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
    hours: {
      type: "entityField",
      label: msg("fields.hours", "Hours"),
      filter: {
        types: ["type.hours"],
      },
      disableConstantValueToggle: true,
    },
    secondHours: {
      type: "entityField",
      label: msg("fields.secondHours", "Second Hours"),
      filter: {
        types: ["type.hours"],
      },
      disableConstantValueToggle: true,
    },
    hoursStyles: {
      label: msg("fields.hoursStyles", "Hours Styles"),
      type: "object",
      objectFields: {
        startOfWeek: {
          label: msg("fields.startOfWeek", "Start Of Week"),
          type: "select",
          options: [
            { label: msg("fields.options.monday", "Monday"), value: "monday" },
            { label: msg("fields.options.tuesday", "Tuesday"), value: "tuesday" },
            { label: msg("fields.options.wednesday", "Wednesday"), value: "wednesday" },
            { label: msg("fields.options.thursday", "Thursday"), value: "thursday" },
            { label: msg("fields.options.friday", "Friday"), value: "friday" },
            { label: msg("fields.options.saturday", "Saturday"), value: "saturday" },
            { label: msg("fields.options.sunday", "Sunday"), value: "sunday" },
            { label: msg("fields.options.today", "Today"), value: "today" },
          ],
        },
        collapseDays: {
          label: msg("fields.collapseDays", "Collapse Days"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        showAdditionalHoursText: {
          label: msg("fields.showAdditionalHoursText", "Show Additional Hours Text"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        alignment: {
          label: msg("fields.alignment", "Alignment"),
          type: "select",
          options: [
            { label: msg("fields.options.start", "Start"), value: "items-start" },
            { label: msg("fields.options.center", "Center"), value: "items-center" },
            { label: msg("fields.options.end", "End"), value: "items-end" },
          ],
        },
      },
    },
  };

export const BusinessFinancialServicesHoursSectionComponent: PuckComponent<
  BusinessFinancialServicesHoursSectionProps
> = (props) => {
  const { t, i18n } = useTranslation();
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
  const intervalTranslations: HoursTableIntervalTranslations = {
    isClosed: t("closed", "Closed"),
    open24Hours: t("open24Hours", "Open 24 Hours"),
    reopenDate: t("reopenDate", "Reopen Date"),
    timeFormatLocale: i18n.language,
  };
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
        <Background
          as="section"
          background={props.section.backgroundColor}
          className={`${hoursTypographyScopeClass} px-0 py-[60px]`}
          style={getSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
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
                style={getSurfaceColorStyle(
                  props.cardSurface.backgroundColor,
                  streamDocument,
                )}
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
                        intervalTranslations={intervalTranslations}
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
                style={getSurfaceColorStyle(
                  props.cardSurface.backgroundColor,
                  streamDocument,
                )}
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
                        intervalTranslations={intervalTranslations}
                      />
                    </EntityField>
                  ) : null}
                </div>
              </article>
            </div>
          </div>
        </Background>
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
