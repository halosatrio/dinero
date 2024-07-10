import {
  IconAdjustmentsHorizontal,
  IconBarbell,
  IconBolt,
  IconBuildingStore,
  IconCar,
  IconCoffee,
  IconCoinFilled,
  IconFirstAidKit,
  IconFriends,
  IconGasStation,
  IconHeartHandshake,
  IconPlaneTilt,
  IconShoppingCartFilled,
  IconToolsKitchen2,
  IconWallet,
} from "@tabler/icons-react";

export function useIcon(category: string): React.ReactNode {
  switch (category) {
    case "income":
      return <IconCoinFilled />;
    case "makan":
      return <IconToolsKitchen2 />;
    case "cafe":
      return <IconCoffee />;
    case "errand":
      return <IconBuildingStore />;
    case "utils":
      return <IconBolt />;
    case "bensin":
      return <IconGasStation />;
    case "olahraga":
      return <IconBarbell />;
    case "belanja":
      return <IconShoppingCartFilled />;
    case "family":
      return <IconFriends />;
    case "misc":
      return <IconAdjustmentsHorizontal />;
    case "transport":
      return <IconCar />;
    case "traveling":
      return <IconPlaneTilt />;
    case "date":
      return <IconHeartHandshake />;
    case "healthcare":
      return <IconFirstAidKit />;
    case "saving":
      return <IconWallet />;
    default:
      break;
  }
}
