import type { SectionConfig } from "@yext/visual-editor";
import { createScopedTypographyStyles } from "../shared/typography";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { FaAddressCard, FaHeadset, FaShieldAlt } from "react-icons/fa";
import { AnalyticsScopeProvider, Address, Link } from "@yext/pages-components";
import { formatPhoneNumber } from "@yext/visual-editor/section-library-support";
import {
  msg,
  Background,
  ComprehensiveCTA,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
  type ComprehensiveCTAValue,
  type StyledTextValue,
  type ThemeColor,
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
import { getLocalizedString } from "../shared/sectionFields";
import {
  getTextStyles,
  renderRichText,
  type RichTextStyleOverrides,
} from "../shared/sectionStyles";

const branchInfoTypographyScopeClass = "bfs-branch-info-typography";
const branchInfoTypographyStyles = createScopedTypographyStyles(
  branchInfoTypographyScopeClass,
  [".bfs-branch-info-address"],
);
import type { AddressType } from "@yext/pages-components";

type StyledTextField = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type RichTextField = {
  text: YextEntityField<TranslatableRichText>;
};

type PhoneItem = {
  number: YextEntityField<string>;
  label?: string;
};

type AmenitiesList = {
  text: YextEntityField<TranslatableString[]>;
};

type CardTextStyles = {
  textStyles: StyledTextValue;
  fontColor?: ThemeColor;
};

type BusinessFinancialServicesBranchInfoSectionProps = {
  sectionHeading: StyledTextField;
  contactCard: {
    title: Pick<StyledTextField, "text">;
    phoneSubheader: YextEntityField<TranslatableString>;
    emailSubheader: YextEntityField<TranslatableString>;
    phoneDetails: {
      items: PhoneItem[];
      phoneFormat: "international" | "domestic";
      includeHyperlink?: boolean;
    };
    languageSupport: AmenitiesList;
    emails: {
      list: YextEntityField<string[]>;
    };
  };
  visitCard: {
    title: Pick<StyledTextField, "text">;
    body: RichTextField;
    address: {
      address: YextEntityField<AddressType>;
      showRegion: boolean;
      showCountry: boolean;
    };
    cta: ComprehensiveCTAValue;
    amenities: AmenitiesList;
  };
  aboutCard: {
    title: Pick<StyledTextField, "text">;
    body: RichTextField;
  };
  cardSurface: {
    backgroundColor: ThemeColor;
    header: CardTextStyles;
    subheader: CardTextStyles;
    content: CardTextStyles;
  };
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const normalizeStringList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((item) =>
          typeof item === "string"
            ? item
            : getLocalizedString(item as TranslatableString | undefined),
        )
        .filter((item) => item.length > 0)
    : [];

const BusinessFinancialServicesBranchInfoSectionFields: YextFields<BusinessFinancialServicesBranchInfoSectionProps> =
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
    sectionHeading: {
      label: msg("fields.sectionHeading", "Section Heading"),
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
    contactCard: {
      label: msg("fields.contactCard", "Contact Card"),
      type: "object",
      objectFields: {
        title: {
          label: msg("fields.title", "Title"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: { types: ["type.string"] },
            },
          },
        },
        phoneSubheader: {
          type: "entityField",
          label: msg("fields.phoneSubheader", "Phone Subheader"),
          filter: { types: ["type.string"] },
        },
        emailSubheader: {
          type: "entityField",
          label: msg("fields.emailSubheader", "Email Subheader"),
          filter: { types: ["type.string"] },
        },
        phoneDetails: {
          label: msg("fields.phones", "Phones"),
          type: "object",
          objectFields: {
            items: {
              label: msg("fields.items", "Items"),
              type: "array",
              arrayFields: {
                number: {
                  type: "entityField",
                  label: msg("fields.number", "Number"),
                  filter: {
                    types: ["type.phone"],
                  },
                },
                label: {
                  label: msg("fields.label", "Label"),
                  type: "text",
                },
              },
              defaultItemProps: {
                number: {
                  field: "",
                  constantValue: "",
                  constantValueEnabled: true,
                },
                label: "",
              },
              getItemSummary: (item) =>
                item.label || item.number?.field || "Phone",
            },
            phoneFormat: {
              label: msg("fields.phoneFormat", "Phone Format"),
              type: "radio",
              options: [
                { label: msg("fields.options.domestic", "Domestic"), value: "domestic" },
                { label: msg("fields.options.international", "International"), value: "international" },
              ],
            },
            includeHyperlink: {
              label: msg("fields.includeHyperlink", "Include Hyperlink"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
          },
        },
        languageSupport: {
          label: msg("fields.languageSupport", "Language Support"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.textList", "Text List"),
              filter: {
                types: ["type.string"],
                includeListsOnly: true,
              },
            },
          },
        },
        emails: {
          label: msg("fields.emails", "Emails"),
          type: "object",
          objectFields: {
            list: {
              type: "entityField",
              label: msg("fields.emails", "Emails"),
              filter: {
                types: ["type.string"],
                includeListsOnly: true,
                allowList: ["emails"],
              },
              disallowTranslation: true,
            },
          },
        },
      },
    },
    visitCard: {
      label: msg("fields.visitCard", "Visit Card"),
      type: "object",
      objectFields: {
        title: {
          label: msg("fields.title", "Title"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: { types: ["type.string"] },
            },
          },
        },
        body: {
          label: msg("fields.body", "Body"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: { types: ["type.rich_text_v2"] },
            },
          },
        },
        address: {
          label: msg("fields.address", "Address"),
          type: "object",
          objectFields: {
            address: {
              type: "entityField",
              label: msg("fields.address", "Address"),
              filter: {
                types: ["type.address"],
              },
            },
            showRegion: {
              label: msg("fields.showRegion", "Show Region"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
            showCountry: {
              label: msg("fields.showCountry", "Show Country"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
          },
        },
        cta: {
          label: msg("fields.callToAction", "Call to Action"),
          type: "comprehensiveCTA",
        },
        amenities: {
          label: msg("fields.amenities", "Amenities"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.textList", "Text List"),
              filter: {
                types: ["type.string"],
                includeListsOnly: true,
              },
            },
          },
        },
      },
    },
    aboutCard: {
      label: msg("fields.aboutCard", "About Card"),
      type: "object",
      objectFields: {
        title: {
          label: msg("fields.title", "Title"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: { types: ["type.string"] },
            },
          },
        },
        body: {
          label: msg("fields.body", "Body"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: { types: ["type.rich_text_v2"] },
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
        header: {
          label: msg("fields.header", "Header"),
          type: "object",
          objectFields: {
            textStyles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        subheader: {
          label: msg("fields.subheader", "Subheader"),
          type: "object",
          objectFields: {
            textStyles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        content: {
          label: msg("fields.content", "Content"),
          type: "object",
          objectFields: {
            textStyles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

export const BusinessFinancialServicesBranchInfoSectionComponent: PuckComponent<
  BusinessFinancialServicesBranchInfoSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextBusinessFinancialServicesBranchInfoSection${getAnalyticsScopeHash(
    props.id,
  )}`;
  const sectionForeground: ThemeColor = {
    selectedColor: props.section.backgroundColor.contrastingColor,
    contrastingColor: props.section.backgroundColor.selectedColor,
  };
  const cardForeground: ThemeColor = {
    selectedColor: props.cardSurface.backgroundColor.contrastingColor,
    contrastingColor: props.cardSurface.backgroundColor.selectedColor,
  };
  const contentRichTextStyleOverrides: RichTextStyleOverrides = {
    ...props.cardSurface.content.textStyles,
    color: props.cardSurface.content.fontColor ?? cardForeground,
  };

  const headingText =
    resolveComponentData(props.sectionHeading.text, locale, streamDocument) ||
    "";
  const contactTitle =
    resolveComponentData(
      props.contactCard.title.text,
      locale,
      streamDocument,
    ) || "";
  const phoneSubheader =
    resolveComponentData(
      props.contactCard.phoneSubheader,
      locale,
      streamDocument,
    ) || "";
  const emailSubheader =
    resolveComponentData(
      props.contactCard.emailSubheader,
      locale,
      streamDocument,
    ) || "";
  const visitTitle =
    resolveComponentData(props.visitCard.title.text, locale, streamDocument) ||
    "";
  const aboutTitle =
    resolveComponentData(props.aboutCard.title.text, locale, streamDocument) ||
    "";
  const visitBody = resolveComponentData(
    props.visitCard.body.text,
    locale,
    streamDocument,
  );
  const aboutBody = resolveComponentData(
    props.aboutCard.body.text,
    locale,
    streamDocument,
  );
  const resolvedAddress = resolveComponentData(
    props.visitCard.address.address,
    locale,
    streamDocument,
  );
  const resolvedEmailValue = resolveComponentData(
    props.contactCard.emails.list,
    locale,
    streamDocument,
  );
  const resolvedEmails = Array.isArray(resolvedEmailValue)
    ? resolvedEmailValue.filter(
        (email): email is string =>
          typeof email === "string" && email.length > 0,
      )
    : [];
  const resolvedPhones = (props.contactCard.phoneDetails.items ?? [])
    .map((item) => {
      const raw = resolveComponentData(item.number, locale, streamDocument);
      const normalized = typeof raw === "string" ? raw.trim() : "";
      if (!normalized) {
        return null;
      }

      return {
        entityField: item.number,
        label: item.label?.trim() ?? "",
        formatted: formatPhoneNumber(
          normalized,
          props.contactCard.phoneDetails.phoneFormat,
        ),
        digits: normalized.replace(/\D/g, ""),
        original: normalized,
      };
    })
    .filter(
      (
        item,
      ): item is {
        entityField: YextEntityField<string>;
        label: string;
        formatted: string;
        digits: string;
        original: string;
      } => item !== null,
    );
  const resolvedLanguagesValue = resolveComponentData(
    props.contactCard.languageSupport.text,
    locale,
    streamDocument,
  );
  const resolvedLanguages = normalizeStringList(resolvedLanguagesValue);
  const resolvedAmenitiesValue = resolveComponentData(
    props.visitCard.amenities.text,
    locale,
    streamDocument,
  );
  const resolvedAmenities = normalizeStringList(resolvedAmenitiesValue);

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <Background
          as="section"
          background={props.section.backgroundColor}
          className={`${branchInfoTypographyScopeClass} px-0 py-[60px]`}
          style={getSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
        >
          <style>{branchInfoTypographyStyles}</style>
          <div className="mx-auto w-full max-w-[1440px] px-[22px]">
            <EntityField
              displayName="Section Heading"
              fieldId={props.sectionHeading.text.field}
              constantValueEnabled={
                props.sectionHeading.text.constantValueEnabled
              }
            >
              <h2
                className="font-[family:var(--fontFamily-h2-fontFamily)] text-center text-[28px] font-normal leading-[1.3] md:text-[36px]"
                style={getTextStyles(
                  props.sectionHeading.styles,
                  props.sectionHeading.fontColor,
                  sectionForeground,
                )}
              >
                {headingText}
              </h2>
            </EntityField>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <article
                className="border border-current/10 px-8 pb-8 pt-8"
                style={getSurfaceColorStyle(
                  props.cardSurface.backgroundColor,
                  streamDocument,
                )}
              >
                <FaHeadset className="mb-7 h-10 w-10" />
                <EntityField
                  displayName="Contact Card Title"
                  fieldId={props.contactCard.title.text.field}
                  constantValueEnabled={
                    props.contactCard.title.text.constantValueEnabled
                  }
                >
                  <h3
                    className="font-[family:var(--fontFamily-h3-fontFamily)] text-2xl font-medium leading-[1.3]"
                    style={getTextStyles(
                      props.cardSurface.header.textStyles,
                      props.cardSurface.header.fontColor,
                      cardForeground,
                    )}
                  >
                    {contactTitle}
                  </h3>
                </EntityField>
                <div className="mt-3">
                  <EntityField
                    displayName="Phone Subheader"
                    fieldId={props.contactCard.phoneSubheader.field}
                    constantValueEnabled={
                      props.contactCard.phoneSubheader.constantValueEnabled
                    }
                  >
                    <p
                      className="font-[family:var(--fontFamily-body-fontFamily)] m-0 text-base font-semibold tracking-[0.08em]"
                      style={getTextStyles(
                        props.cardSurface.subheader.textStyles,
                        props.cardSurface.subheader.fontColor,
                        cardForeground,
                      )}
                    >
                      {phoneSubheader}
                    </p>
                  </EntityField>
                  <div className="mt-1 grid gap-0.5">
                    {resolvedPhones.map((item, index) =>
                      props.contactCard.phoneDetails.includeHyperlink &&
                      item.digits ? (
                        <EntityField
                          key={`${item.label}-${index}`}
                          displayName="Phone Number"
                          fieldId={item.entityField.field}
                          constantValueEnabled={
                            item.entityField.constantValueEnabled
                          }
                        >
                          <p
                            className="font-[family:var(--fontFamily-body-fontFamily)] m-0 text-base"
                            style={getTextStyles(
                              props.cardSurface.content.textStyles,
                              props.cardSurface.content.fontColor,
                              cardForeground,
                            )}
                          >
                            {item.label ? <span>{item.label} </span> : null}
                            <Link
                              cta={{ link: item.digits, linkType: "PHONE" }}
                              eventName={`phone${index}`}
                              className="font-[family:var(--fontFamily-link-fontFamily)] underline hover:no-underline"
                              style={getTextStyles(
                                props.cardSurface.content.textStyles,
                                props.cardSurface.content.fontColor,
                                cardForeground,
                              )}
                            >
                              {item.formatted}
                            </Link>
                          </p>
                        </EntityField>
                      ) : (
                        <EntityField
                          key={`${item.label}-${index}`}
                          displayName="Phone Number"
                          fieldId={item.entityField.field}
                          constantValueEnabled={
                            item.entityField.constantValueEnabled
                          }
                        >
                          <p
                            className="font-[family:var(--fontFamily-body-fontFamily)] m-0 text-base"
                            style={getTextStyles(
                              props.cardSurface.content.textStyles,
                              props.cardSurface.content.fontColor,
                              cardForeground,
                            )}
                          >
                            {item.label
                              ? `${item.label} ${item.formatted}`
                              : item.formatted}
                          </p>
                        </EntityField>
                      ),
                    )}
                    {resolvedLanguages.length ? (
                      <EntityField
                        displayName="Language Support"
                        fieldId={props.contactCard.languageSupport.text.field}
                        constantValueEnabled={
                          props.contactCard.languageSupport.text
                            .constantValueEnabled
                        }
                      >
                        <p
                          className="font-[family:var(--fontFamily-body-fontFamily)] m-0 text-base"
                          style={getTextStyles(
                            props.cardSurface.content.textStyles,
                            props.cardSurface.content.fontColor,
                            cardForeground,
                          )}
                        >
                          {resolvedLanguages.join(", ")}
                        </p>
                      </EntityField>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3">
                  <EntityField
                    displayName="Email Subheader"
                    fieldId={props.contactCard.emailSubheader.field}
                    constantValueEnabled={
                      props.contactCard.emailSubheader.constantValueEnabled
                    }
                  >
                    <p
                      className="font-[family:var(--fontFamily-body-fontFamily)] m-0 text-base font-semibold tracking-[0.08em]"
                      style={getTextStyles(
                        props.cardSurface.subheader.textStyles,
                        props.cardSurface.subheader.fontColor,
                        cardForeground,
                      )}
                    >
                      {emailSubheader}
                    </p>
                  </EntityField>
                  <EntityField
                    displayName="Email Addresses"
                    fieldId={props.contactCard.emails.list.field}
                    constantValueEnabled={
                      props.contactCard.emails.list.constantValueEnabled
                    }
                  >
                    <div className="mt-1 grid gap-0.5">
                      {resolvedEmails.map((email, index) => (
                        <Link
                          key={`${email}-${index}`}
                          cta={{ link: email, linkType: "EMAIL" }}
                          eventName={`email${index}`}
                          className="font-[family:var(--fontFamily-link-fontFamily)] text-base underline hover:no-underline"
                          style={getTextStyles(
                            props.cardSurface.content.textStyles,
                            props.cardSurface.content.fontColor,
                            cardForeground,
                          )}
                        >
                          {email.replace(/^mailto:/i, "")}
                        </Link>
                      ))}
                    </div>
                  </EntityField>
                </div>
              </article>
              <article
                className="border border-current/10 px-8 pb-8 pt-8"
                style={getSurfaceColorStyle(
                  props.cardSurface.backgroundColor,
                  streamDocument,
                )}
              >
                <FaShieldAlt className="mb-7 h-10 w-10" />
                <EntityField
                  displayName="Visit Card Title"
                  fieldId={props.visitCard.title.text.field}
                  constantValueEnabled={
                    props.visitCard.title.text.constantValueEnabled
                  }
                >
                  <h3
                    className="font-[family:var(--fontFamily-h3-fontFamily)] text-2xl font-medium leading-[1.3]"
                    style={getTextStyles(
                      props.cardSurface.header.textStyles,
                      props.cardSurface.header.fontColor,
                      cardForeground,
                    )}
                  >
                    {visitTitle}
                  </h3>
                </EntityField>
                <EntityField
                  displayName="Visit Card Body"
                  fieldId={props.visitCard.body.text.field}
                  constantValueEnabled={
                    props.visitCard.body.text.constantValueEnabled
                  }
                >
                  <div className="font-[family:var(--fontFamily-body-fontFamily)] mt-3 text-base leading-7">
                    {renderRichText(visitBody, contentRichTextStyleOverrides)}
                  </div>
                </EntityField>
                {resolvedAddress ? (
                  <EntityField
                    displayName="Branch Address"
                    fieldId={props.visitCard.address.address.field}
                    constantValueEnabled={
                      props.visitCard.address.address.constantValueEnabled
                    }
                  >
                    <div
                      className="bfs-branch-info-address font-[family:var(--fontFamily-body-fontFamily)] mt-3 text-base leading-7"
                      style={getTextStyles(
                        props.cardSurface.content.textStyles,
                        props.cardSurface.content.fontColor,
                        cardForeground,
                      )}
                    >
                      <Address
                        address={resolvedAddress}
                        showRegion={props.visitCard.address.showRegion}
                        showCountry={props.visitCard.address.showCountry}
                      />
                    </div>
                  </EntityField>
                ) : null}
                <BackgroundProvider
                  value={{
                    ...props.cardSurface.backgroundColor,
                    isDarkColor: isDarkColor(props.cardSurface.backgroundColor),
                  }}
                >
                  <EntityField
                    displayName="Visit Card Call to Action"
                    fieldId={props.visitCard.cta.data?.cta?.field}
                    constantValueEnabled={
                      props.visitCard.cta.data?.cta?.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={
                        props.visitCard.cta as Partial<ComprehensiveCTAValue>
                      }
                      className="mt-2 inline-flex"
                      eventName="bookAppointment"
                    />
                  </EntityField>
                </BackgroundProvider>
                {resolvedAmenities.length ? (
                  <EntityField
                    displayName="Branch Amenities"
                    fieldId={props.visitCard.amenities.text.field}
                    constantValueEnabled={
                      props.visitCard.amenities.text.constantValueEnabled
                    }
                  >
                    <ul
                      className="font-[family:var(--fontFamily-body-fontFamily)] mt-3 list-disc pl-4 text-base leading-7"
                      style={getTextStyles(
                        props.cardSurface.content.textStyles,
                        props.cardSurface.content.fontColor,
                        cardForeground,
                      )}
                    >
                      {resolvedAmenities.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </EntityField>
                ) : null}
              </article>
              <article
                className="border border-current/10 px-8 pb-8 pt-8"
                style={getSurfaceColorStyle(
                  props.cardSurface.backgroundColor,
                  streamDocument,
                )}
              >
                <FaAddressCard className="mb-7 h-10 w-10" />
                <EntityField
                  displayName="About Card Title"
                  fieldId={props.aboutCard.title.text.field}
                  constantValueEnabled={
                    props.aboutCard.title.text.constantValueEnabled
                  }
                >
                  <h3
                    className="font-[family:var(--fontFamily-h3-fontFamily)] text-2xl font-medium leading-[1.3]"
                    style={getTextStyles(
                      props.cardSurface.header.textStyles,
                      props.cardSurface.header.fontColor,
                      cardForeground,
                    )}
                  >
                    {aboutTitle}
                  </h3>
                </EntityField>
                <EntityField
                  displayName="About Card Body"
                  fieldId={props.aboutCard.body.text.field}
                  constantValueEnabled={
                    props.aboutCard.body.text.constantValueEnabled
                  }
                >
                  <div className="font-[family:var(--fontFamily-body-fontFamily)] mt-3 text-base leading-7">
                    {renderRichText(aboutBody, contentRichTextStyleOverrides)}
                  </div>
                </EntityField>
              </article>
            </div>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesBranchInfoSection: YextComponentConfig<BusinessFinancialServicesBranchInfoSectionProps> =
  {
    label: "Branch Info Section",
    fields: BusinessFinancialServicesBranchInfoSectionFields,
    defaultProps: {
      sectionHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Branch Information",
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
      contactCard: {
        title: {
          text: {
            field: "",
            constantValue: {
              defaultValue: "Contact Us",
              hasLocalizedValue: "true",
            },
            constantValueEnabled: true,
          },
        },
        phoneSubheader: {
          field: "",
          constantValue: {
            defaultValue: "By Phone",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        emailSubheader: {
          field: "",
          constantValue: {
            defaultValue: "By Email",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        phoneDetails: {
          items: [
            {
              number: {
                field: "mainPhone",
                constantValue: "",
                constantValueEnabled: false,
              },
              label: "Main Phone",
            },
            {
              number: {
                field: "",
                constantValue: "+1 (704) 555-0112",
                constantValueEnabled: true,
              },
              label: "Customer Service",
            },
          ],
          phoneFormat: "domestic",
          includeHyperlink: true,
        },
        languageSupport: {
          text: {
            field: "",
            constantValue: ["English", "Spanish", "Chinese", "French"],
            constantValueEnabled: true,
          },
        },
        emails: {
          list: {
            field: "emails",
            constantValue: [""],
            constantValueEnabled: false,
          },
        },
      },
      visitCard: {
        title: {
          text: {
            field: "",
            constantValue: {
              defaultValue: "Visit Us",
              hasLocalizedValue: "true",
            },
            constantValueEnabled: true,
          },
        },
        body: {
          text: {
            field: "",
            constantValue: {
              defaultValue: getDefaultRTF(
                "Private consultations and branch services are available at this location.",
              ),
              hasLocalizedValue: "true",
            },
            constantValueEnabled: true,
          },
        },
        address: {
          address: {
            field: "address",
            constantValue: {
              line1: "",
              city: "",
              postalCode: "",
              countryCode: "",
              region: "",
            },
            constantValueEnabled: false,
          },
          showRegion: true,
          showCountry: false,
        },
        cta: {
          data: {
            actionType: "link",
            cta: {
              field: "",
              constantValue: {
                label: {
                  defaultValue: "Book Appointment",
                  hasLocalizedValue: "true",
                },
                link: {
                  defaultValue: "#team",
                  hasLocalizedValue: "true",
                },
                linkType: "URL",
                ctaType: "textAndLink",
              },
              constantValueEnabled: true,
              selectedType: "textAndLink",
            },
            openInNewTab: false,
          },
          styles: {
            variant: "link",
            color: undefined,
            link: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
              letterSpacing: "default",
              includeCaret: "none",
            },
          },
        },
        amenities: {
          text: {
            field: "",
            constantValue: [
              "Private consultations",
              "Accessible entrance",
              "Notary on-site",
              "Drive-thru ATM",
            ],
            constantValueEnabled: true,
          },
        },
      },
      aboutCard: {
        title: {
          text: {
            field: "",
            constantValue: {
              defaultValue: "About This Branch",
              hasLocalizedValue: "true",
            },
            constantValueEnabled: true,
          },
        },
        body: {
          text: {
            field: "",
            constantValue: {
              defaultValue: {
                json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Service area: [[address.city]] metro\\n","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"\\nNMLS number: 1987654\\n","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"\\nADA compliant entrance, elevator access, private consultation rooms","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
                html: '<p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>Service area: [[address.city]] metro\n</span></p><p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>\nNMLS number: 1987654\n</span></p><p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>\nADA compliant entrance, elevator access, private consultation rooms</span></p>',
              },
              hasLocalizedValue: "true",
            },
            constantValueEnabled: true,
          },
        },
      },
      cardSurface: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        header: {
          textStyles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        subheader: {
          textStyles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "uppercase",
          },
          fontColor: undefined,
        },
        content: {
          textStyles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
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
      <BusinessFinancialServicesBranchInfoSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesBranchInfoSection",
  displayName: "Branch Info Section",
  description: "Branch Info Section",
  pageSetTypes: ["ENTITY"],
};
