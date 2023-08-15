import { useIsSubmitting } from "remix-validated-form";

export type FormSubmitButtonProps = {
  text?: string;
  textProcessing?: string;
}

export const FormSubmitButton = (props: FormSubmitButtonProps) => {
  const isSubmitting = useIsSubmitting();

  const text = props.text || 'Submit';
  const textProcessing = props.textProcessing || 'Submitting...';

  return (
    <button type="submit" disabled={ isSubmitting }>
      { isSubmitting ? textProcessing : text }
    </button>
  );
};
