import type { SectionConfig } from "@yext/visual-editor";
import { createScopedTypographyStyles } from "../shared/typography";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  msg,
  Background,
  ComprehensiveCTA,
  createItemSource,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
  Image,
  type ComprehensiveCTAValue,
  type EnhancedTranslatableCTA,
  type StyledImageValue,
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
import {
  imageAspectRatioOptions,
  type StyledTextField,
  type StyledTextStyles,
} from "../shared/sectionFields";
import {
  getTextStyles,
  renderRichText,
  type RichTextStyleOverrides,
} from "../shared/sectionStyles";

const teamTypographyScopeClass = "bfs-team-typography";
const teamTypographyStyles = createScopedTypographyStyles(
  teamTypographyScopeClass,
  [".bfs-team-card-details"],
);

type TeamMember = {
  image: YextEntityField<TranslatableAssetImage>;
  name: YextEntityField<TranslatableString>;
  role: YextEntityField<TranslatableString>;
  credentialsLabel: YextEntityField<TranslatableString>;
  credentials: YextEntityField<TranslatableString>;
  licensesLabel: YextEntityField<TranslatableString>;
  licenses: YextEntityField<TranslatableString[]>;
  specialtiesLabel: YextEntityField<TranslatableString>;
  specialties: YextEntityField<TranslatableRichText>;
  cta: YextEntityField<EnhancedTranslatableCTA>;
};

function teamMemberDefaultItem(
  name: string,
  role: string,
  credentials: string,
  licenses: string[],
  specialty: string,
  imagePath: string,
): TeamMember {
  return {
    image: {
      field: "",
      constantValue: {
        url: imagePath,
        width: 800,
        height: 1067,
      },
      constantValueEnabled: true,
    },
    name: {
      field: "",
      constantValue: { defaultValue: name, hasLocalizedValue: "true" },
      constantValueEnabled: true,
    },
    role: {
      field: "",
      constantValue: { defaultValue: role, hasLocalizedValue: "true" },
      constantValueEnabled: true,
    },
    credentialsLabel: {
      field: "",
      constantValue: {
        defaultValue: "Credentials",
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
    credentials: {
      field: "",
      constantValue: { defaultValue: credentials, hasLocalizedValue: "true" },
      constantValueEnabled: true,
    },
    licensesLabel: {
      field: "",
      constantValue: {
        defaultValue: "Licenses",
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
    licenses: {
      field: "",
      constantValue: licenses,
      constantValueEnabled: true,
    },
    specialtiesLabel: {
      field: "",
      constantValue: {
        defaultValue: "Specialties",
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
    specialties: {
      field: "",
      constantValue: {
        defaultValue: getDefaultRTF(specialty),
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
    cta: {
      field: "",
      constantValue: {
        label: { defaultValue: "Learn More", hasLocalizedValue: "true" },
        link: { defaultValue: "#footer", hasLocalizedValue: "true" },
        linkType: "URL",
        ctaType: "textAndLink",
      },
      constantValueEnabled: true,
    },
  };
}

const teamMembersSource = createItemSource<TeamMember>({
  label: msg("fields.teamMembers", "Team Members"),
  mappingFields: {
    image: {
      label: msg("fields.image", "Image"),
      type: "entityField",
      filter: {
        types: ["type.image"],
      },
    },
    name: {
      label: msg("fields.name", "Name"),
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    role: {
      label: msg("fields.role", "Role"),
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    credentialsLabel: {
      label: msg("fields.credentialsLabel", "Credentials Label"),
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    credentials: {
      label: msg("fields.credentials", "Credentials"),
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    licensesLabel: {
      label: msg("fields.licensesLabel", "Licenses Label"),
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    licenses: {
      label: msg("fields.licenses", "Licenses"),
      type: "entityField",
      filter: { types: ["type.string"], includeListsOnly: true },
    },
    specialtiesLabel: {
      label: msg("fields.specialtiesLabel", "Specialties Label"),
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    specialties: {
      label: msg("fields.specialties", "Specialties"),
      type: "entityField",
      filter: { types: ["type.rich_text_v2"] },
    },
    cta: {
      label: msg("fields.callToAction", "Call to Action"),
      type: "entityField",
      filter: { types: ["type.cta"] },
    },
  },
  defaultValues: [
    teamMemberDefaultItem(
      "Morgan Lee",
      "Senior Wealth Advisor",
      "CFP",
      ["Series 7", "Series 66"],
      "Supports retirement planning and portfolio review conversations.",
      "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
    ),
    teamMemberDefaultItem(
      "Avery Chen",
      "Financial Planner",
      "ChFC",
      ["Series 65"],
      "Supports financial planning and goal-based discussions.",
      "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
    ),
  ],
});

const teamMemberCtaStyles: ComprehensiveCTAValue["styles"] = {
  variant: "primary",
  color: {
    selectedColor: "palette-quaternary",
    contrastingColor: "palette-quaternary-contrast",
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
};

export type BusinessFinancialServicesTeamSectionProps = {
  heading: StyledTextField;
  teamMembers: typeof teamMembersSource.value;
  cardStyles: {
    image: {
      styles: StyledImageValue;
      aspectRatio: number;
      imageConstrain: "fixed" | "filled";
    };
    name: StyledTextStyles;
    role: StyledTextStyles;
    label: StyledTextStyles;
    value: StyledTextStyles;
  };
  cardSurface: {
    backgroundColor: ThemeColor;
  };
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const BusinessFinancialServicesTeamSectionFields: YextFields<BusinessFinancialServicesTeamSectionProps> =
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
    teamMembers: teamMembersSource.field,
    cardStyles: {
      label: msg("fields.cardStyles", "Card Styles"),
      type: "object",
      objectFields: {
        image: {
          label: msg("fields.image", "Image"),
          type: "object",
          objectFields: {
            styles: {
              label: msg("fields.imageStyles", "Image Styles"),
              type: "styledImage",
            },
            aspectRatio: {
              label: msg("fields.aspectRatio", "Aspect Ratio"),
              type: "select",
              options: imageAspectRatioOptions,
            },
            imageConstrain: {
              label: msg("fields.imageConstrain", "Image Constrain"),
              type: "select",
              options: [
                { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
                { label: msg("fields.options.filled", "Filled"), value: "filled" },
              ],
            },
          },
        },
        name: {
          label: msg("fields.name", "Name"),
          type: "object",
          objectFields: {
            styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        role: {
          label: msg("fields.role", "Role"),
          type: "object",
          objectFields: {
            styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        label: {
          label: msg("fields.labels", "Labels"),
          type: "object",
          objectFields: {
            styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        value: {
          label: msg("fields.values", "Values"),
          type: "object",
          objectFields: {
            styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
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
  };

export const BusinessFinancialServicesTeamSectionComponent: PuckComponent<
  BusinessFinancialServicesTeamSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextBusinessFinancialServicesTeamSection${getAnalyticsScopeHash(
    props.id,
  )}`;
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const teamMembers = teamMembersSource.resolveItems(
    props.teamMembers,
    streamDocument,
  );
  const cardForeground = props.cardSurface.backgroundColor.contrastingColor;
  const valueRichTextStyleOverrides: RichTextStyleOverrides = {
    ...props.cardStyles.value.styles,
    color: props.cardStyles.value.fontColor,
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
          className={`${teamTypographyScopeClass} px-0 py-[60px]`}
          style={getSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
        >
          <style>{teamTypographyStyles}</style>
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
            <EntityField
              displayName="Team Members"
              fieldId={props.teamMembers.field}
              constantValueEnabled={props.teamMembers.constantValueEnabled}
            >
              <div className="mx-auto mt-10 grid max-w-[760px] gap-2 md:grid-cols-2">
                {teamMembers.map((item, index) => {
                  const image = item.image;
                  const name = item.name
                    ? resolveComponentData(item.name, locale, streamDocument)
                    : "";
                  const role = item.role
                    ? resolveComponentData(item.role, locale, streamDocument)
                    : "";
                  const credentialsLabel = item.credentialsLabel
                    ? resolveComponentData(
                        item.credentialsLabel,
                        locale,
                        streamDocument,
                      )
                    : "";
                  const credentials = item.credentials
                    ? resolveComponentData(
                        item.credentials,
                        locale,
                        streamDocument,
                      )
                    : "";
                  const licensesLabel = item.licensesLabel
                    ? resolveComponentData(
                        item.licensesLabel,
                        locale,
                        streamDocument,
                      )
                    : "";
                  const licensesValue = item.licenses;
                  const licenses = Array.isArray(licensesValue)
                    ? licensesValue.filter(
                        (license): license is string =>
                          typeof license === "string" && license.length > 0,
                      )
                    : [];
                  const specialtiesLabel = item.specialtiesLabel
                    ? resolveComponentData(
                        item.specialtiesLabel,
                        locale,
                        streamDocument,
                      )
                    : "";
                  const specialties = item.specialties
                    ? resolveComponentData(
                        item.specialties,
                        locale,
                        streamDocument,
                      )
                    : "";
                  const itemFields = props.teamMembers.constantValueEnabled
                    ? props.teamMembers.constantValue[index]
                    : props.teamMembers.mappings;

                  return (
                    <article
                      key={`${name}-${index}`}
                      className="font-[family:var(--fontFamily-body-fontFamily)] border border-current/10 px-[18px] pb-[18px] pt-4 text-center"
                      style={getSurfaceColorStyle(
                        props.cardSurface.backgroundColor,
                        streamDocument,
                      )}
                    >
                      {image ? (
                        <EntityField
                          displayName={`Team Member ${index + 1} Image`}
                          fieldId={itemFields?.image.field}
                          constantValueEnabled={
                            itemFields?.image.constantValueEnabled
                          }
                        >
                          <div
                            className="mb-[18px] w-full overflow-hidden border-2 border-current/10"
                            style={{
                              aspectRatio:
                                props.cardStyles.image.aspectRatio > 0
                                  ? props.cardStyles.image.aspectRatio
                                  : undefined,
                              borderRadius:
                                props.cardStyles.image.styles.borderRadius ===
                                "default"
                                  ? undefined
                                  : props.cardStyles.image.styles.borderRadius,
                            }}
                          >
                            <Image
                              image={image}
                              className={
                                props.cardStyles.image.aspectRatio > 0
                                  ? "block h-full w-full"
                                  : "block w-full"
                              }
                              style={{
                                display: "block",
                                height:
                                  props.cardStyles.image.aspectRatio > 0
                                    ? "100%"
                                    : "auto",
                                objectFit:
                                  props.cardStyles.image.imageConstrain ===
                                  "filled"
                                    ? "cover"
                                    : "contain",
                                objectPosition: "center",
                                width: "100%",
                              }}
                            />
                          </div>
                        </EntityField>
                      ) : null}
                      <EntityField
                        displayName={`Team Member ${index + 1} Name`}
                        fieldId={itemFields?.name.field}
                        constantValueEnabled={
                          itemFields?.name.constantValueEnabled
                        }
                      >
                        <h3
                          className="font-[family:var(--fontFamily-h3-fontFamily)] text-2xl font-medium leading-[1.3]"
                          style={getTextStyles(
                            props.cardStyles.name.styles,
                            props.cardStyles.name.fontColor,
                            cardForeground,
                          )}
                        >
                          {name}
                        </h3>
                      </EntityField>
                      <EntityField
                        displayName={`Team Member ${index + 1} Role`}
                        fieldId={itemFields?.role.field}
                        constantValueEnabled={
                          itemFields?.role.constantValueEnabled
                        }
                      >
                        <p
                          className="font-[family:var(--fontFamily-body-fontFamily)] mb-[14px] mt-0.5 text-base leading-6"
                          style={getTextStyles(
                            props.cardStyles.role.styles,
                            props.cardStyles.role.fontColor,
                            cardForeground,
                          )}
                        >
                          {role}
                        </p>
                      </EntityField>
                      <div className="bfs-team-card-details font-[family:var(--fontFamily-body-fontFamily)] grid grid-cols-[110px_1fr] gap-x-2 gap-y-1 text-left text-base leading-6">
                        <EntityField
                          displayName={`Team Member ${index + 1} Credentials Label`}
                          fieldId={itemFields?.credentialsLabel.field}
                          constantValueEnabled={
                            itemFields?.credentialsLabel.constantValueEnabled
                          }
                        >
                          <span
                            className="font-semibold"
                            style={getTextStyles(
                              props.cardStyles.label.styles,
                              props.cardStyles.label.fontColor,
                              cardForeground,
                            )}
                          >
                            {credentialsLabel}
                          </span>
                        </EntityField>
                        <EntityField
                          displayName={`Team Member ${index + 1} Credentials`}
                          fieldId={itemFields?.credentials.field}
                          constantValueEnabled={
                            itemFields?.credentials.constantValueEnabled
                          }
                        >
                          <span
                            style={getTextStyles(
                              props.cardStyles.value.styles,
                              props.cardStyles.value.fontColor,
                              cardForeground,
                            )}
                          >
                            {credentials}
                          </span>
                        </EntityField>
                        <EntityField
                          displayName={`Team Member ${index + 1} Licenses Label`}
                          fieldId={itemFields?.licensesLabel.field}
                          constantValueEnabled={
                            itemFields?.licensesLabel.constantValueEnabled
                          }
                        >
                          <span
                            className="font-semibold"
                            style={getTextStyles(
                              props.cardStyles.label.styles,
                              props.cardStyles.label.fontColor,
                              cardForeground,
                            )}
                          >
                            {licensesLabel}
                          </span>
                        </EntityField>
                        <EntityField
                          displayName={`Team Member ${index + 1} Licenses`}
                          fieldId={itemFields?.licenses.field}
                          constantValueEnabled={
                            itemFields?.licenses.constantValueEnabled
                          }
                        >
                          <span
                            style={getTextStyles(
                              props.cardStyles.value.styles,
                              props.cardStyles.value.fontColor,
                              cardForeground,
                            )}
                          >
                            {licenses.map((license, licenseIndex) => (
                              <React.Fragment
                                key={`${license}-${licenseIndex}`}
                              >
                                {license}
                                {licenseIndex < licenses.length - 1 ? ", " : ""}
                              </React.Fragment>
                            ))}
                          </span>
                        </EntityField>
                        <EntityField
                          displayName={`Team Member ${index + 1} Specialties Label`}
                          fieldId={itemFields?.specialtiesLabel.field}
                          constantValueEnabled={
                            itemFields?.specialtiesLabel.constantValueEnabled
                          }
                        >
                          <span
                            className="font-semibold"
                            style={getTextStyles(
                              props.cardStyles.label.styles,
                              props.cardStyles.label.fontColor,
                              cardForeground,
                            )}
                          >
                            {specialtiesLabel}
                          </span>
                        </EntityField>
                        <EntityField
                          displayName={`Team Member ${index + 1} Specialties`}
                          fieldId={itemFields?.specialties.field}
                          constantValueEnabled={
                            itemFields?.specialties.constantValueEnabled
                          }
                        >
                          <div>
                            {renderRichText(
                              specialties,
                              valueRichTextStyleOverrides,
                            )}
                          </div>
                        </EntityField>
                      </div>
                      {item.cta ? (
                        <div className="mt-[18px]">
                          <EntityField
                            displayName={`Team Member ${index + 1} Call to Action`}
                            fieldId={itemFields?.cta.field}
                            constantValueEnabled={
                              itemFields?.cta.constantValueEnabled
                            }
                          >
                            <ComprehensiveCTA
                              value={{
                                data: {
                                  actionType: "link",
                                  cta: {
                                    field: "",
                                    constantValue: item.cta,
                                    constantValueEnabled: true,
                                    selectedType: item.cta.ctaType,
                                  },
                                  openInNewTab: item.cta.openInNewTab ?? false,
                                },
                                styles: teamMemberCtaStyles,
                              }}
                              className="inline-flex min-h-[42px] items-center justify-center rounded-full px-[18px] py-2.5 no-underline"
                            />
                          </EntityField>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </EntityField>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesTeamSection: YextComponentConfig<BusinessFinancialServicesTeamSectionProps> =
  {
    label: "Team Section",
    fields: BusinessFinancialServicesTeamSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Meet The Team",
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
      teamMembers: teamMembersSource.defaultValue,
      cardStyles: {
        image: {
          styles: {
            borderRadius: "default",
          },
          aspectRatio: 0.75,
          imageConstrain: "filled",
        },
        name: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        role: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        label: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        value: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
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
      <BusinessFinancialServicesTeamSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesTeamSection",
  displayName: "Team Section",
  description: "Team Section",
  pageSetTypes: ["ENTITY"],
};
