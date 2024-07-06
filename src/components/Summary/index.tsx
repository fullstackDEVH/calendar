import playIcon from "../../assets/play.svg";
import phoneIcon from "../../assets/phone.svg";

const Summary = () => {
  return (
    <div className="h-[60px] px-4 py-[10px] bg-color-summary flex items-center">
      <div className="flex items-center">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <div className="bg-[#DE3A3A] w-3 h-3 rounded-full"></div>
            <h3 className="text-[20px] tracking-[3%] text-white font-medium">
              00:55
            </h3>
          </div>

          <div className="bg-[#F9F5FF] rounded-full py-1 px-[10px] cursor-pointer">
            <div className="flex gap-1">
              <img src={playIcon} alt={playIcon} width={12} height={12} />
              <span className="text-txt-primary text-[16px] font-medium leading-[20px]">
                On call
              </span>
            </div>
          </div>

          <div className="bg-[#2E90FA] w-[64px] h-[40px] grid place-items-center rounded-lg cursor-pointer">
            <span className="text-sm font-semibold text-white">Hold</span>
          </div>

          <div className="bg-[#D92D20] w-[56px] h-[40px] grid place-items-center rounded-lg cursor-pointer">
            <img src={phoneIcon} alt={phoneIcon} width={28} height={28} />
          </div>

          <div className="flex items-center gap-2 text-white ml-[12rem]">
            <span className="text-[32px] font-semibold">[David]</span>
            <span className="text-[32px]">calling</span>
            <span className="text-[32px] font-semibold">[Nail shop ABC]</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
