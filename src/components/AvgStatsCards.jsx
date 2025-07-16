import { useMemo } from "react";
import { statCards } from "../constants/metrics";

export function AvgStatsCards({ data }) {
  const averages = useMemo(() => {
    const grouped = {};

    data.forEach((item) => {
      if (!grouped[item.type]) {
        grouped[item.type] = { total: 0, count: 0 };
      }
      grouped[item.type].total += item.value;
      grouped[item.type].count += 1;
    });
    const result = {};
    for (const key in grouped) {
      result[key] = +(grouped[key].total / grouped[key].count).toFixed(1);
    }
    console.log('AvgStatsCards: averages: ', grouped, result);
    return result;
  }, [data]);

  return (
    <div className="w-full flex flex-wrap pt-6 md:pt-0 items-center justify-center md:justify-evenly gap-8 sm:gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.name}
          className="relative hover:shadow-xl border border-gray-100 dark:border-gray-700 rounded-md h-[150px] flex min-w-[150px] sm:min-w-[280px] justify-between 
           items-center py-4 px-2 sm:p-4 bg-white dark:bg-gray-800 shadow-lg"
        >
          <div className="text-black text-center w-full sm:text-left mt-4 sm:mt-0 dark:text-white sm:mr-2">
            <p className="text-sm md:text-lg">{stat.label}</p>
            <p className="text-md md:text-xl">
              {averages[stat.name] ?? 0} {stat.unit}
            </p>
          </div>
          <div
            className={`${stat.bg} ${stat.color} absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 
          sm:translate-0 sm:static text-xl md:text-3xl p-2 rounded-md`}
          >
            <stat.icon />
          </div>
        </div>
      ))}
    </div>
  );
}
