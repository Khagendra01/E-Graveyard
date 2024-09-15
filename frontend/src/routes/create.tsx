import React, { useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, redirect } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BgViewWrapper from "@/components/bg-view-wrapper";
import { ImgDrapDrop } from "@/components/img-drag-drop";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth0 } from "@auth0/auth0-react";
import { API_URL } from "@/Constants";
import uploadToS3 from "@/lib/aws-setup";
import { useNavigate } from "react-router-dom";

const personSchema = z.object({
  name: z
    .string()
    .max(255, "Name must be at most 255 characters")
    .min(1, "Name is required"),
  surname: z
    .string()
    .max(255, "Surname must be at most 255 characters")
    .min(1, "Surname is required"),
  otherName: z
    .string()
    .max(255, "Nickname must be at most 255 characters")
    .optional(),
  gender: z
    .string()
    .max(15, "Gender must be at most 15 characters")
    .min(1, "Gender is required"),
  isAlive: z.boolean(),
  content: z.string().min(1, "Content is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  dod: z.string().optional(),
});

type PersonFormValues = z.infer<typeof personSchema>;

export default function CreatePerson() {
  const [files, setFiles] = useState<File[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth0();
  const navigate = useNavigate();
  const [voiceFiles, setVoiceFiles] = useState<File[]>([]);

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      isAlive: false,
    },
  });

  if (isAuthLoading) {
    return (
      <BgViewWrapper>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      </BgViewWrapper>
    );
  }

  if (!isAuthLoading && !isAuthenticated) {
    navigate("/");
    return null;
  }

  async function onSubmit(data: PersonFormValues) {
    if (!isAuthenticated) {
      alert("You need to be logged in to create a person");
      return;
    }

    setIsLoading(true);
    setSubmissionStatus("Submitting form data...");
    try {
      const submitData = {
        name: data.name,
        surname: data.surname,
        other_Name: data.otherName,
        gender: data.gender,
        is_alive: data.isAlive,
        content: data.content,
        dob: data.dob,
        dod: data.dod,
        owner: user?.email,
      };
      const response = await fetch(API_URL + "/api/graves/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const resData = await response.json();
      // console.log(resData);

      if (files.length === 0) {
        setSubmissionStatus("Please upload at least one image.");
        return;
      }
      setSubmissionStatus("Uploading images...");
      const imageUrls = await Promise.all(
        files.map((file) => uploadToS3(file))
      );

      console.log({ imageUrls });
      imageUrls.forEach((url) => {
        // post route grave-images/
        console.log({
          grave: resData.id,
          image: url,
          owner: user?.email,
        });
        fetch(API_URL + "/api/grave-images/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grave: resData.id,
            image: url,
            owner: user?.email,
          }),
        })
          .then((res) => res.json())
          .then((resData) => console.log({ personImage: resData }))
          .catch((err) => {
            console.error(err);
            setSubmissionStatus("An error occurred. Please try again.");
          });
      });

      if (voiceFiles.length === 0) {
        setSubmissionStatus("Please upload at least one voice file.");
        return;
      }
      setSubmissionStatus("Uploading voice files...");

      console.log({ voiceFiles });
      const voiceUrls = await Promise.all(
        voiceFiles.map((file) => uploadToS3(file))
      );

      console.log({ voiceUrls });

      voiceFiles.forEach((url) => {
        // post route grave-voices/
        console.log({
          grave_id: resData.id,
          voice_url: url,
        });
        fetch(API_URL + "/api/audio-files/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grave: resData.id,
            voice: url,
          }),
        })
          .then((res) => res.json())
          .then((resData) => console.log({ personVoice: resData }))
          .catch((err) => {
            console.error(err);
            setSubmissionStatus("An error occurred. Please try again.");
          });
      });

      // Step 3: Update person record with image and voice URLs
      setSubmissionStatus("Updating record with image and voice URLs...");
      // await updatePersonWithImagesAndVoices(id, imageUrls, voiceUrls);

      setSubmissionStatus("Person created successfully!");
    } catch (error) {
      console.error("Error in submission process:", error);
      setSubmissionStatus("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <BgViewWrapper>
      <div className="container max-w-6xl mx-auto text-white relative z-10 min-h-screen p-16 overflow-hidden">
        <Link to="/" className={buttonVariants({ variant: "secondary" })}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Link>

        <div className="flex justify-between my-8 max-w-lg">
          <h1 className="text-3xl font-bold">Create Person</h1>
          {/* <AudioPlayer src="/track.mp3" /> */}
        </div>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit);
            }}
            className="space-y-6 max-w-lg"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Controller
                      name="gender"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue=""
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white w-full p-2 rounded-lg"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAlive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="bg-gray-800 border-gray-700"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is Alive</FormLabel>
                    <FormDescription>
                      Check if the person is currently alive
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {!form.getValues("isAlive") && (
              <FormField
                control={form.control}
                name="dod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Death</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImgDrapDrop files={files} setFiles={setFiles} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Voice Files</FormLabel>
              <FormControl className="text-white">
                <Input
                  type="file"
                  accept="audio/mpeg3"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setVoiceFiles(Array.from(e.target.files));
                    }
                  }}
                  className="bg-gray-800 border-gray-700 text-white change-to-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <Button
              onClick={form.handleSubmit(onSubmit)}
              type="submit"
              variant="secondary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create Person"
              )}
            </Button>
          </form>
        </Form>

        {submissionStatus && (
          <div className="mt-4 p-4 bg-gray-800 rounded-md">
            <p className="text-white">{submissionStatus}</p>
          </div>
        )}
      </div>
    </BgViewWrapper>
  );
}
