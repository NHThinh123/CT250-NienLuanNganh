import { useParams } from "react-router-dom";
import useDishById from "../features/dish/hooks/useDishById";
import DishDetail from "../features/dish/components/templates/DishDetail";

const DishDetailPage = () => {
  const { id } = useParams();
  const { dishData, isLoading, isError } = useDishById(id);
  console.log(dishData, isLoading, isError);
  return (
    <>
      {/* <ButtonCustomize margin={"8px 0px"} to={"/posts/create"}>
        Thêm bài đăng
      </ButtonCustomize> */}
      
      <DishDetail dishData={dishData} isLoading={isLoading} isError={isError}/>;
    </>
  );
};

export default DishDetailPage;
