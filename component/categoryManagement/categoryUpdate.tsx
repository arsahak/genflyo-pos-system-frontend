"use client";

import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { useSidebar } from "@/lib/SidebarContext";
import { useStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdClose, MdImage, MdSave } from "react-icons/md";
import { CategoryFormSkeleton } from "./components/CategoryFormSkeleton";

interface ParentCategory {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoryUpdate() {
  const { user } = useStore();
  const { isDarkMode } = useSidebar();
  const { language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const t = (key: string) => getTranslation(key, language);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingImage, setExistingImage] = useState<{
    url: string;
    publicId?: string;
  } | null>(null);
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>(
    []
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategory: "",
    order: "0",
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  useEffect(() => {
    if (!categoryId) {
      toast.error("Category ID is required");
      router.push("/products/categories");
      return;
    }
    loadCategory();
    loadParentCategories();
  }, [categoryId]);

  const loadParentCategories = async () => {
    try {
      const response = await api.get("/categories?limit=100");
      if (response.data.categories) {
        setParentCategories(
          response.data.categories.filter(
            (cat: ParentCategory & { parentCategory?: string }) =>
              !cat.parentCategory && cat._id !== categoryId
          )
        );
      }
    } catch (error) {
      console.error("Failed to load parent categories:", error);
    }
  };

  const loadCategory = async () => {
    try {
      setFetching(true);
      const response = await api.get(`/categories/${categoryId}`);
      const category = response.data;

      setFormData({
        name: category.name || "",
        description: category.description || "",
        parentCategory: category.parentCategory?._id || "",
        order: category.order?.toString() || "0",
        isFeatured: category.isFeatured || false,
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
        metaKeywords: category.metaKeywords?.join(", ") || "",
      });

      setExistingImage(category.image);
    } catch (error: unknown) {
      console.error("Failed to load category:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to load category";
      toast.error(errorMessage);
      router.push("/products/categories");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeNewImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const removeExistingImage = () => {
    setExistingImage(null);
    toast("Image will be removed when you save the category", {
      icon: "ℹ️",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      });

      await api.put(`/categories/${categoryId}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category updated successfully!");
      router.push("/products/categories");
    } catch (error: unknown) {
      console.error("Error updating category:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update category";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const canEditCategories =
    user.role === "super_admin" || user.permissions?.canEditProducts;

  if (!canEditCategories) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            {t("accessDenied")}
          </h2>
          <p className="text-red-600">
            {t("noPermissionCategory")}
          </p>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className={`min-h-screen p-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-950" : "bg-slate-50"
      }`}>
        <CategoryFormSkeleton isDarkMode={isDarkMode} />
      </div>
    );
  }

  const inputClass = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
    isDarkMode 
      ? "bg-gray-900 border-gray-700 text-gray-100 focus:ring-indigo-500/20" 
      : "bg-white border-gray-300 text-gray-900"
  }`;

  const labelClass = `block text-sm font-semibold mb-2 ${
    isDarkMode ? "text-gray-300" : "text-gray-700"
  }`;

  const cardClass = `rounded-2xl shadow-sm p-6 ${
    isDarkMode ? "bg-gray-800 shadow-lg shadow-gray-900/20" : "bg-white shadow-xl shadow-slate-200/50"
  }`;

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950" : "bg-slate-50"
    }`}>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            {t("updateCategory")}
          </h1>
          <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {t("editCategoryInfo")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className={cardClass}>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                {t("basicInformation")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    {t("categoryName")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder={t("categoryName")}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>
                    {t("description")}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={inputClass}
                    placeholder={t("description")}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {t("parentCategoryLabel")}
                  </label>
                  <select
                    name="parentCategory"
                    value={formData.parentCategory}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">None (Main Category)</option>
                    {parentCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className={`mt-2 text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                    {t("parentCategoryHelp")}
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    {t("displayOrder")}
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </div>
                    <span className={`ml-3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {t("markFeatured")}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className={cardClass}>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                {t("seoSettings")} <span className={`text-sm font-normal ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{t("optional")}</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    {t("metaTitle")}
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={t("metaTitle")}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {t("metaDescription")}
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass}
                    placeholder={t("metaDescription")}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {t("metaKeywords")}
                  </label>
                  <input
                    type="text"
                    name="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Category Image */}
            <div className={cardClass}>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                {t("categoryImage")}
              </h2>

              <div className="space-y-6">
                {/* Existing Image */}
                {existingImage && !imagePreview && (
                  <div className="flex flex-col items-center">
                    <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                      {t("currentImage")}
                    </h3>
                    <div className="relative inline-block group">
                      <img
                        src={existingImage.url}
                        alt="Current"
                        className="w-full h-64 object-cover rounded-2xl shadow-lg border-4 border-white dark:border-gray-700"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={removeExistingImage}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                        >
                          <MdClose size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center w-full">
                  <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                    isDarkMode 
                      ? "border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-indigo-500/50" 
                      : "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400"
                  }`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className={`p-4 rounded-full mb-3 ${isDarkMode ? "bg-indigo-900/20" : "bg-indigo-100"}`}>
                        <MdImage className={`w-8 h-8 ${isDarkMode ? "text-indigo-400" : "text-indigo-500"}`} />
                      </div>
                      <p className={`mb-2 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-indigo-900"}`}>
                        {existingImage ? "Change Image" : t("clickToUpload")}
                      </p>
                      <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        {t("imageFormatHelp")}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* New Image Preview */}
                {imagePreview && (
                  <div className="mt-6 flex flex-col items-center">
                    <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                      {t("newImagePreview")}
                    </h3>
                    <div className="relative inline-block group">
                      <img
                        src={imagePreview}
                        alt="New Preview"
                        className="w-full h-64 object-cover rounded-2xl shadow-lg border-4 border-white dark:border-gray-700"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button
                          type="button"
                          onClick={removeNewImage}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                        >
                          <MdClose size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions / Tips could go here if needed, or just leave as column for image */}
          </div>

          {/* Form Actions - Full Width */}
          <div className="lg:col-span-3 flex items-center justify-end gap-4 pb-10 border-t border-gray-200 dark:border-gray-800 pt-6">
            <button
              type="button"
              onClick={() => router.push("/products/categories")}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                isDarkMode 
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t("updating")}</span>
                </>
              ) : (
                <>
                  <MdSave size={20} />
                  <span>{t("updateCategory")}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
