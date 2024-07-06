import logo from "../../assets/logo.svg";
import logoutIcon from "../../assets/logout.svg";

const Heading = () => {
  return (
    <div className="h-16 px-4 py-2">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center justify-center">
          <img src={logo} alt={logo} width={80} height={48} />
          <h2 className="text-[20px] leading-[36px] font-semibold text-[#101828]">
            TELENAIL
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="py-3 px-[18px] bg-[#032A94] flex items-center gap-[6px] rounded-lg">
            <img src={logoutIcon} alt={logoutIcon} width={20} height={20} />
            <span className="text-base font-semibold text-white">Pending</span>
          </div>

          <div className="px-4 flex gap-4 items-center">
            <span className="text-[#344054] text-base font-semibold">
              Xin chào, Nguyễn Văn T
            </span>

            <div className="rounded-full w-8 h-8 bg-[#05F448] flex justify-center items-center">
              <span className="text-white font-medium text-[20px] tracking-[0.15px] leading-[160%]">
                T
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heading;
