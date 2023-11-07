"use client";

import { Setting } from "@/lib/editor/editor-options";
import { cn } from "@/lib/utils";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  AlertTriangleIcon,
  ChevronsUpDownIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "lucide-react";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Input, inputClassNames } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyLead } from "../ui/typography/TypographyLead";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { AudioPreview } from "./audio-preview";
// import TagListElement from "./tag-list-element";
import dynamic from "next/dynamic";

const TagListElement = dynamic(() => import("./tag-list-element"), {
  ssr: false,
});

export default function SettingElement({
  setting,
  updateFn,
  valueAtLoad,
  inlined = false,
  existingDynamicThemes = [],
  isUserApproved,
  adventureId = "",
}: {
  setting: Setting;
  updateFn: (key: string, value: any) => void;
  valueAtLoad: any;
  inlined?: boolean;
  existingDynamicThemes?: { value: string; label: string }[];
  isUserApproved: boolean;
  adventureId?: string;
}) {
  let [value, setValue] = useState(valueAtLoad || setting.default);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newValue = e.target.files[0];
    updateFn(setting.name, newValue);
  };

  const onTextboxChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateFn(setting.name, newValue);
  };

  const onTextboxIntChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    updateFn(setting.name, newValue);
  };

  const onTextboxFloatChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    updateFn(setting.name, newValue);
  };

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked === true;
    setValue(newValue);
    updateFn(setting.name, newValue);
  };

  const onSelectChange = (newValue: string) => {
    setValue(newValue);
    updateFn(setting.name, newValue);
  };

  const addToList = (e: any) => {
    const newVal =
      setting.listof == "object" ? {} : setting.listof == "text" ? "" : null;
    setValue((old: any) => {
      const ret = [...(Array.isArray(old) ? old : []), newVal];
      updateFn(setting.name, ret);
      return ret;
    });
  };

  const removeItem = (i: number) => {
    setValue((old: any) => {
      const ret = (old || []).filter((_: any, index: number) => {
        return i != index;
      });
      updateFn(setting.name, ret);
      return ret;
    });
  };

  const updateItem = ({
    index,
    subField,
    value,
  }: {
    index: number;
    subField?: string;
    value: any;
  }) => {
    setValue((old: any) => {
      // Go through the old items.
      const ret = (old || []).map((prior: any, thisIndex: number) => {
        // If this is the item being updated.
        if (index === thisIndex) {
          if (subField) {
            // If it's a subfield, the set that subfield assuming it's an object
            // Note: this code only works one layer deep.
            prior[subField] = value;
            return prior;
          } else {
            // Else, it's a primitive value.
            return value;
          }
        } else {
          // If this isn't the item being updated, return as is.
          return prior;
        }
      });
      updateFn(setting.name, ret);
      return ret;
    });
  };

  let innerField = <></>;
  const isDisabled = setting.requiresApproval && !isUserApproved;

  if (setting.type == "text") {
    innerField = <Input type="text" value={value} onChange={onTextboxChange} />;
  } else if (setting.type == "int") {
    innerField = (
      <Input
        type="number"
        step="1"
        value={value}
        onChange={onTextboxIntChange}
      />
    );
  } else if (setting.type == "float") {
    innerField = (
      <Input type="number" value={value} onChange={onTextboxFloatChange} />
    );
  } else if (setting.type == "image") {
    innerField = (
      <Input
        onChange={onInputChange}
        id="picture"
        type="file"
        className="hover:cursor-pointer"
        disabled={isDisabled}
      />
    );
  } else if (setting.type === "textarea") {
    innerField = (
      <TextareaAutosize
        className={cn(
          inputClassNames,
          "w-full py-[.6rem] resize-none disabled:cursor-default"
        )}
        value={value}
        onChange={onTextboxChange}
        maxRows={8}
        disabled={isDisabled}
      />
    );
  } else if (setting.type == "boolean") {
    innerField = (
      <div key={setting.name}>
        <Input
          type="checkbox"
          checked={value ? true : undefined}
          id={setting.name}
          name={setting.name}
          onChange={onCheckboxChange}
          disabled={isDisabled}
        />
        <label htmlFor={setting.name}>&nbsp;Yes</label>
      </div>
    );
  } else if (setting.type == "select") {
    const options = [
      ...(setting.options || []),
      ...(setting.includeDynamicOptions == "image-themes"
        ? existingDynamicThemes
        : []),
    ];

    console.log(options);
    console.log(setting.includeDynamicOptions);

    innerField = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="my-4 px-4">
            <div className="mr-2">{value}</div>
            <ChevronsUpDownIcon size={24} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className="hover:cursor-pointer"
              onClick={(e) => {
                onSelectChange(option.value || "");
              }}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else if (setting.type == "options") {
    innerField = (
      <div className="space-y-2">
        {setting.options?.map((option) => (
          <div key={option.value} className="flex flex-row items-start">
            <Input
              type="radio"
              checked={value === option.value ? true : undefined}
              id={option.value}
              name={setting.name}
              value={option.value}
              onChange={onTextboxChange}
              disabled={isDisabled}
            />
            <label className="select-none" htmlFor={option.value}>
              <div className="flex flex-row">
                {option?.audioSample && (
                  <AudioPreview voiceId={option.audioSample} />
                )}
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
              )}
            </label>
          </div>
        ))}
      </div>
    );
  } else if (setting.type == "longtext") {
    innerField = (
      <Textarea
        onChange={onTextboxChange}
        value={value}
        disabled={isDisabled}
      />
    );
  } else if (setting.type == "tag-list") {
    const _value = Array.isArray(value) ? value : [];
    innerField = (
      <TagListElement
        value={_value}
        setValue={(newArr: string[]) => {
          setValue(newArr);
          updateFn(setting.name, newArr);
        }}
        disabled={isDisabled}
      />
    );
  } else if (setting.type == "divider") {
    innerField = (
      <div className="pt-4 pb-2">
        <TypographyH3>{setting.label}</TypographyH3>
        <TypographyMuted>{setting.description}</TypographyMuted>
      </div>
    );
  } else if (setting.type == "list") {
    const _value = Array.isArray(value) ? value : [];
    console.log("value", _value);
    innerField = (
      <div>
        <ul>
          {_value.map((subValue: any, i: number) => {
            const remove = () => {
              removeItem(i);
            };
            return (
              <li
                key={`${setting.name}.${i}`}
                className="flex flex-row items-start space-y-3"
              >
                <button onClick={remove} className="px-4 mt-4">
                  <MinusCircleIcon />
                </button>
                <div className="border-l-4 pl-4 py-4">
                  {setting.listof == "object" ? (
                    (setting.listSchema || []).map((subField) => {
                      return (
                        <SettingElement
                          key={`${setting.name}.${i}.${subField.name}`}
                          valueAtLoad={subValue[subField.name] || []}
                          setting={subField}
                          existingDynamicThemes={existingDynamicThemes}
                          adventureId={adventureId}
                          updateFn={(subFieldName: string, value: any) => {
                            updateItem({
                              index: i,
                              subField: subFieldName,
                              value: value,
                            });
                          }}
                          isUserApproved={isUserApproved}
                        />
                      );
                    })
                  ) : (
                    <SettingElement
                      key={`${setting.name}.${i}._`}
                      valueAtLoad={subValue || null}
                      adventureId={adventureId}
                      existingDynamicThemes={existingDynamicThemes}
                      setting={{
                        ...setting,
                        type: setting.listof as any,
                      }}
                      inlined={true}
                      updateFn={(_: any, value: any) => {
                        updateItem({ index: i, value: value });
                      }}
                      isUserApproved={isUserApproved}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <button onClick={addToList} className="flex flex-row items-center mt-4">
          <PlusCircleIcon /> &nbsp; Add New
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        isDisabled &&
          "p-4 border border-yellow-600 rounded-md relative overflow-hidden"
      )}
    >
      {isDisabled && (
        <div className="w-full absolute top-0 left-0 h-full bg-background/90 z-20">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <TypographyLarge>
              {setting.requiredText || "This setting requires approval."}
            </TypographyLarge>
            <TypographyLead>
              You can still share your published game with your friends using{" "}
              <a
                target="_blank"
                className="text-blue-600 hover:underline"
                href={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures/${adventureId}`}
              >
                this link
              </a>
              .
            </TypographyLead>
            <TypographyLead>
              Reach out on{" "}
              <a
                href="steamship.com/discord"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Discord
              </a>{" "}
              to be approved.
            </TypographyLead>
          </div>
        </div>
      )}
      {!inlined && setting.type != "divider" && (
        <TypographyLead className="space-y-6">{setting.label}</TypographyLead>
      )}
      {!inlined && setting.unused && (
        <Alert className="my-2 border-red-200">
          <AlertTriangleIcon className="h-4 w-4 mt-2" />
          <AlertTitle className="text-lg">Coming Soon</AlertTitle>
          <AlertDescription>
            This setting isn&apos;t yet wired in to gameplay.
          </AlertDescription>
        </Alert>
      )}
      {!inlined && setting.type != "divider" && setting.description && (
        <div className="text-sm text-muted-foreground mb-2">
          {setting.description}
        </div>
      )}{" "}
      <div>{innerField}</div>
    </div>
  );
}
