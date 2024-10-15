"use client";
import { type Market } from "@/app/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CircleX } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const CreateMarket = ({ community }: { community: string }) => {
  const [fileInfo, setFileInfo] = useState({ fileName: "", fileURL: "" });
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [fileListKey, setFileListKey] = useState<number>(0);
  const [date, setDate] = useState<Date>();

  const form = useForm<Market>({
    defaultValues: {
      title: "",
      community: community,
      banner: "",
      outcomes: [],
      betEndTime: 0,
    },
  });
  const { register, handleSubmit, resetField } = form;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        setFileInfo({
          fileName: file.name,
          fileURL: URL.createObjectURL(file),
        });
        const formData = new FormData();

        formData.append("file", file);
        setImageUploading(true);
      }
    }
  };

  const handleResetImage = () => {
    setFileListKey((prev) => prev + 1);
    setFileInfo({
      fileName: "",
      fileURL: "",
    });

    resetField(`banner`);
  };

  const createMarket = () => {};

  return (
    <div>
      <FormProvider {...form}>
        <div className="flex flex-col gap-4">
          <Input className="bg-black text-white" placeholder="Title" {...register("title")} />
          <div className="flex gap-4 items-center">
            <input
              key={fileListKey}
              id="file-input"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-input"
              className={`${
                fileInfo.fileName === "" ? "flex" : "hidden"
              } rounded-lg cursor-pointer  flex-row flex-1 border border-gray-500`}
            >
              <span className="whitespace-nowrap bg-black p-2 border border-gray-500 rounded-lg text-[14px]">
                Choose File
              </span>
              <input
                type="text"
                value={fileInfo.fileName || "No file chosen"}
                placeholder="No file chosen"
                readOnly
                className="w-full p-2 text-[14px] bg-black rounded-lg"
              />
            </label>
            <div
              className={`relative ${
                fileInfo.fileName === "" ? "hidden" : ""
              } ${imageUploading === true ? "bg-black opacity-20" : ""}`}
            >
              <img src={fileInfo.fileURL} alt="header" className="w-40 h-40 object-cover rounded" />
              <button
                type="button"
                onClick={handleResetImage}
                className={`absolute top-0 right-0 m-2 border-2 border-black rounded-full ${
                  imageUploading === true ? "hidden" : ""
                }`}
              >
                <CircleX />
              </button>
              {imageUploading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs">Bet End Time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={() => handleSubmit(createMarket)} className="w-40 ml-auto">
            Post
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};
