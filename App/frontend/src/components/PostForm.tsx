import { useForm } from 'react-hook-form';
import { useImageUpload } from '../hooks/useImageUpload';
import type { PostPayload } from '../types';

interface PostFormProps {
  initialValues?: {
    title: string;
    content: string;
    imageUrls?: string[];
  };
  onSubmit: (payload: PostPayload) => void;
  submitting?: boolean;
}

type FormValues = {
  title: string;
  content: string;
  imageUrls: string[];
};

const PostForm = ({ initialValues, onSubmit, submitting }: PostFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      title: initialValues?.title ?? '',
      content: initialValues?.content ?? '',
      imageUrls: initialValues?.imageUrls ?? [],
    },
  });

  const { uploadImage, uploading, error } = useImageUpload();
  const imageUrls = watch('imageUrls');

  const handleImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => uploadImage(file)),
      );
      const next = [...(imageUrls ?? []), ...uploads];
      setValue('imageUrls', next);
    } catch (err) {
      console.error(err);
    } finally {
      event.target.value = '';
    }
  };

  const removeImage = (url: string) => {
    setValue(
      'imageUrls',
      (imageUrls ?? []).filter((item) => item !== url),
    );
  };

  const submitForm = (values: FormValues) => {
    const payload: PostPayload = {
      title: values.title.trim(),
      content: {
        text: values.content.trim(),
        imageUrl: (values.imageUrls ?? []).filter(Boolean),
      },
    };
    onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          {...register('title', { required: 'Title is required', minLength: 3 })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          rows={10}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          {...register('content', {
            required: 'Content is required',
            minLength: { value: 10, message: 'Write at least 10 characters' },
          })}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Images</label>
        <div className="mt-2 flex flex-col gap-4 rounded-lg border border-dashed border-slate-300 p-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImages}
          />
          {uploading && <p className="text-sm text-slate-500">Uploading...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {imageUrls && imageUrls.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3">
              {imageUrls.map((url) => (
                <div
                  key={url}
                  className="group relative aspect-video overflow-hidden rounded-lg"
                >
                  <img
                    src={url}
                    alt="Uploaded"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Saving...' : 'Save Post'}
      </button>
    </form>
  );
};

export default PostForm;

