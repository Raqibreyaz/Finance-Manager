import { Header } from "@/components/Header";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14"> {children}</main>
    </>
  );
};

export default DashboardLayout;
