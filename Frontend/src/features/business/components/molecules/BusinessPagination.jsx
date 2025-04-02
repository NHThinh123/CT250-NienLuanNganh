import { Pagination } from "antd";
const BusinessPagination = ({ onPageChange, totalItems, itemsPerPage }) => {
  let totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) totalPages = 1; // Đảm bảo luôn có ít nhất 1 trang
  return (
    <Pagination
      simple
      total={totalPages * itemsPerPage}
      pageSize={itemsPerPage}
      onChange={onPageChange}
    />
  );
};
export default BusinessPagination;
