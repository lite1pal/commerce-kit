import { addProductReview } from "../review-actions";
import Button from "@/app/components/Button";
import {
  Input,
  Textarea,
  Select,
  StarRating,
} from "@/app/components/FormControls";

function ReviewForm({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  return (
    <form className="space-y-4" action={addProductReview}>
      <Input type="hidden" name="productId" value={productId} />
      <Input type="hidden" name="userId" value={userId} />
      <StarRating name="rating" label="Rating" defaultValue={5} />
      <Textarea name="comment" label="Comment" rows={3} fullWidth />
      <Button type="submit" variant="primary" fullWidth>
        Submit Review
      </Button>
    </form>
  );
}

export default ReviewForm;
