import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import Purchases from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
import styles from './styles.js';

const ENTITLEMENT_ID = 'sixs_3dollar_unlimited';

const PackageItem = ({ purchasePackage, setIsPurchasing }) => {
  const {
    product: { title, description, price_string },
  } = purchasePackage;

  const navigation = useNavigation();

  const onSelection = async () => {
    setIsPurchasing(true);

    try {
      const { purchaserInfo } = await Purchases.purchasePackage(purchasePackage);
        console.log("in SetIsPurchasing");
      if (typeof purchaserInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined') {
        console.log("User is Unlimited", purchaserInfo)
        // navigation.goBack();
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert('Error purchasing package', e);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Pressable onPress={onSelection} style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.terms}>{description}</Text>
      </View>
      <Text style={styles.title}>{price_string}</Text>
    </Pressable>
  );
};

export default PackageItem;