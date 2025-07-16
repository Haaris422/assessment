import { IoFootstepsOutline } from "react-icons/io5";
import { LuGlassWater } from "react-icons/lu";
import { TbActivityHeartbeat } from "react-icons/tb";
import { MdOutlineEnergySavingsLeaf } from "react-icons/md";

export const statCards = [
    {
        name:'steps',
        label:'Average Steps',
        icon:IoFootstepsOutline,
        color:'text-yellow-500',
        bg:'bg-yellow-50 dark:bg-yellow-900/20' 
    },
    {
        name:'waterIntake',
        label:'Total Water Intake',
        icon:LuGlassWater,
        color:'text-blue-500',
        bg:'bg-blue-50 dark:bg-blue-900/20' 
    },
    {
        name:'heartRate',
        label:'Average Heart Rate',
        icon:TbActivityHeartbeat,
        color:'text-red-500',
        bg:'bg-red-50 dark:bg-red-900/20' 
    },
    {
        name:'calorieIntake',
        label:'Total Calorie Intake',
        icon:MdOutlineEnergySavingsLeaf,
        color:'text-green-500',
        bg:'bg-green-50 dark:bg-green-900/20' 
    },
];

export const metrics = [
  {
    key: 'steps',
    label: 'Steps',
    unit: 'steps',
    color: '#733e0a',
    icon: '👟'
  },
  {
    key: 'water',
    label: 'Water Intake',
    unit: 'ml',
    color: '#1c398e',
    icon: '💧'
  },
  {
    key: 'heartRate',
    label: 'Heart Rate',
    unit: 'bpm',
    color: '#82181a',
    icon: '❤️'
  },
  {
    key: 'calorieIntake',
    label: 'Calorie Intake',
    unit: 'kcal',
    color: '#0d542b',
    icon: '⚖️'
  },
];

export const getMetricConfig = (type) => {
  return metrics.find(m => m.key === type) || metrics[0];
};

export const buttonStyle="w-full mt-2 bg-red-400 hover:bg-red-700 cursor-pointer text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2";
export const dropDownStyle ="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"