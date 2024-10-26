import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  
    container: {
        flex: 1,
        backgroundColor: '#0A0A0F',
         paddingTop:50// Deep space black
      },
      scrollContainer: { 
        flexGrow: 1,
        padding: 20,
        paddingBottom: 40,
      },
      title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#00FF9D', // Bright neon green
        textShadowColor: 'rgba(0, 255, 157, 0.4)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
      },
      card: {
        backgroundColor: '#1A1A2E', // Deep navy blue
        borderRadius: 15,
        padding: 20,
        width: '100%',
        elevation: 10,
        marginBottom: 20,
        shadowColor: '#00FF9D',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#2A2A4E',
      },
      inputContainer: {
        width: '100%',
        marginBottom: 15,
      },
      input: {
        height: 50,
        backgroundColor: '#2A2A4E', // Darker navy for input
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#3D3D6B',
        shadowColor: '#00FF9D',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
      },
      button: {
        flex: 0.48,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
      },
      primaryButton: {
        backgroundColor: '#00FF9D', // Neon green primary button
        shadowColor: '#00FF9D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
      },
      secondaryButton: {
        backgroundColor: '#FF00E5', // Neon pink secondary button
        shadowColor: '#FF00E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
      },
      buttonText: {
        color: '#0A0A0F', // Dark text on light button
        fontSize: 16,
        fontWeight: 'bold',
      },
      secondaryButtonText: {
        color: '#FFFFFF', // Light text on dark button
        fontSize: 16,
        fontWeight: 'bold',
      },
      recentSearches: {
        marginTop: 20,
      },
      recentTitle: {
        fontSize: 16,
        marginBottom: 10,
        color: '#00FF9D',
        fontWeight: '600',
        textShadowColor: 'rgba(0, 255, 157, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
      recentButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      recentButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#2A2A4E',
        borderRadius: 10,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#3D3D6B',
        shadowColor: '#00FF9D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      recentButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      errorContainer: {
        backgroundColor: '#3D1818', // Dark red for errors
        padding: 15,
        borderRadius: 10,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#FF4444',
        shadowColor: '#FF4444',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      errorText: {
        color: '#FF4444',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
      },
      resultCard: {
        backgroundColor: '#1A1A2E',
        padding: 20,
        borderRadius: 15,
        elevation: 12,
        marginTop: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#2A2A4E',
        shadowColor: '#00FF9D',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      asteroidName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00FF9D',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 255, 157, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
      },
      hazardContainer: {
        marginVertical: 10,
        alignItems: 'center',
      },
      hazardText: {
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
      asteroidImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginVertical: 15,
        shadowColor: '#00FF9D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      detailsContainer: {
        marginTop: 10,
        backgroundColor: '#2A2A4E',
        padding: 15,
        borderRadius: 10,
      },
      detailText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#FFFFFF',
      },
      linkButton: {
        backgroundColor: '#FF00E5', // Neon pink
        padding: 12,
        borderRadius: 10,
        marginTop: 15,
        alignItems: 'center',
        shadowColor: '#FF00E5',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      linkButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
      },
      imageContainer: {
        marginVertical: 15,
      },
      imageInfo: {
        padding: 15,
        backgroundColor: '#2A2A4E',
        borderRadius: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#3D3D6B',
      },
      imageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00FF9D',
        marginBottom: 5,
      },
      imageDate: {
        fontSize: 14,
        color: '#BBBBBB',
        marginBottom: 3,
      },
      imageCopyright: {
        fontSize: 12,
        color: '#999999',
        fontStyle: 'italic',
        marginBottom: 5,
      },
      imageDescription: {
        fontSize: 14,
        color: '#FFFFFF',
        lineHeight: 20,
      },
      approachTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00FF9D',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 255, 157, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
    }); 
    
    