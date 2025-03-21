import {useEffect} from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { Input, InputField } from "@/components/ui/input";

type LoginSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginSheet = ({ isOpen, onClose }: LoginSheetProps): JSX.Element => {

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <View style={{ padding: 16, width: "100%" }}>
          <Text size="xl" bold style={{ marginBottom: 16 }}>
            Sign In With Google
          </Text>
          <Input style={{ marginBottom: 16 }}>
            <InputField placeholder="Username" />
          </Input>
          <Input style={{ marginBottom: 16 }}>
            <InputField placeholder="Password" type="password" />
          </Input>

          <Button
            size="md"
            variant="solid"
            style={{ width: "100%" }}
            onPress={onClose}
          >
            <ButtonText>Login</ButtonText>
          </Button>
        </View>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default LoginSheet;
