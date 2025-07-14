import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Chrome as Home } from 'lucide-react-native';

// Standard Android phone dimensions
const PHONE_WIDTH = 360;

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.brandTitle}>FAST 168</Text>
          <Text style={styles.title}>404</Text>
          <Text style={styles.subtitle}>This screen doesn't exist.</Text>
          <Link href="/" style={styles.link}>
            <View style={styles.linkContent}>
              <Home size={20} color="#E91E63" />
              <Text style={styles.linkText}>Go to home screen</Text>
            </View>
          </Link>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    maxWidth: PHONE_WIDTH,
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#E91E63',
    letterSpacing: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 72,
    fontFamily: 'Poppins-Bold',
    color: '#E91E63',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.2)',
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
    marginLeft: 8,
  },
});