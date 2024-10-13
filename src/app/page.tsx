import { Bet } from "../component/Bet";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 h-screen">
      <div className="flex flex-row gap-2 overflow-clip h-[20vh]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="bg-[#ffffff12] text-[#D1D5DB] w-full rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 ">
        <Bet
          title="Sample Title"
          banner="/images/placeholder.png"
          outcomes={[
            { id: "1", title: "Outcome 1" },
            { id: "2", title: "Outcome 2" },
          ]}
          betEndTime={1234567890}
          description="Sample Description"
        />
      </div>
    </div>
  );
}
