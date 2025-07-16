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

export const fields = [
  {
    key: 'steps',
    label: 'Steps',
    unit: 'steps',
    color: '#3B82F6',
    icon: '👟'
  },
  {
    key: 'water',
    label: 'Water Intake',
    unit: 'ml',
    color: '#06B6D4',
    icon: '💧'
  },
  {
    key: 'heartRate',
    label: 'Heart Rate',
    unit: 'bpm',
    color: '#EF4444',
    icon: '❤️'
  },
  {
    key: 'calorieIntake',
    label: 'Calorie Intake',
    unit: 'kcal',
    color: '#8B5CF6',
    icon: '⚖️'
  },
];

export const getMetricConfig = (type) => {
  return fields.find(m => m.key === type) || fields[0];
};