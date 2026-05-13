"use client";

import {useState} from "react";
import {authClient} from "@/lib/auth-client";
import Image from "next/image";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import Loading from "@/app/loading";

const ProfilePage = () => {
  const {data, isPending} = authClient.useSession();

  const user = data?.user;

  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: "",
      image: "",
    },
  });

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center dark:text-white text-slate-700">
        <span className="mr-2">Waiting...  </span>
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center">
        <p>User not found. Please login again.</p>
      </div>
    );
  }

  const onSubmit = async (formData) => {
    try {
      const res = await authClient.updateUser({
        name: formData.name,
        image: formData.image,
      });
        console.log("FAILED:", res);

      if (res?.data?.status) {
          setOpenModal(false);
          toast.success("Profile updated successfully!");
         reset({
           name: "",
           image: "",
         });
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className=" p-2 lg:p-5">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-3xl overflow-hidden border border-base-300 mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 relative" />

        {/* Profile */}
        <div className="px-4 md:px-6 pb-8">
          <div className="flex flex-col items-center mt-6">
            <div className="rounded-full border border-white overflow-hidden shadow-lg">
              <Image
                src={user?.image || userImg}
                alt={user?.name || "User"}
                width={130}
                height={130}
                className="object-cover w-34 h-34"
                referrerPolicy="no-referrer"
              />
            </div>

            <span className="m-7 px-4 py-1 md:text-2xl font-bold rounded-full bg-indigo-200 text-indigo-900 capitalize">
              {user?.name || "Unknown User"}
            </span>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-slate-300 rounded-xl p-4">
              <p className="text-sm text-gray-500">Email Address</p>
              <h3 className="text-base font-semibold md:text-lg text-slate-700">
                {user?.email}
              </h3>
            </div>

            <div className="bg-gray-100 dark:bg-slate-300 rounded-xl p-4">
              <p className="text-sm text-gray-500">Role</p>
              <h3 className="text-base font-semibold md:text-lg text-slate-700 capitalize">
                {user?.role}
              </h3>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() => setOpenModal(true)}
            className="btn w-full mt-8 bg-linear-to-r from-indigo-500 to-purple-600 border-none text-white"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-5 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">
              Update Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Name
                </label>

                <input
                  type="text"
                  className="input input-bordered w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("name", {required: "Name is required"})}
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Profile Image URL
                </label>

                <input
                  type="url"
                  className="input input-bordered w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("image", {required: "Image URL is required"})}
                />

                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn w-full bg-gradient-to-r from-indigo-500 to-purple-600 border-none text-white hover:opacity-90"
              >
                Update Information
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
