import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
});

const RoomScreen = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState<boolean | null>(null);

  useEffect(() => {
    // 🔹 Connexion réussie
    socket.on("connect", () => {
      console.log("✅ Connecté au WebSocket :", socket.id);
    });

    // 🔹 Écoute la réponse du serveur lorsqu'un match est trouvé
    socket.on("matchFound", (data) => {
      console.log("🎮 Match trouvé :", data);
      setRoomId(data.roomId);
    });

    // 🔹 Écoute l'événement de démarrage de partie
    socket.on("gameStart", (data) => {
      console.log("🚀 La partie commence !", data);
      setIsPlayer1(data.isPlayer1);
    });

    return () => {
      socket.off("matchFound");
      socket.off("gameStart");
    };
  }, []);

  // 🔹 Rejoindre la file d'attente
  const joinQueue = () => {
    socket.emit("joinQueue");
    console.log("📥 Demande d'entrée dans la file d'attente...");
  };

  // 🔹 Quitter la file d'attente
  const leaveQueue = () => {
    socket.emit("leaveQueue");
    setRoomId(null);
    setIsPlayer1(null);
    console.log("📤 Sortie de la file d'attente.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matchmaking</Text>

      {roomId ? (
        <Text style={styles.roomText}>🎮 Match trouvé ! Room ID: {roomId}</Text>
      ) : (
        <Text style={styles.waitingText}>⌛ En attente de match...</Text>
      )}

      {isPlayer1 !== null && (
        <Text style={styles.playerText}>
          {isPlayer1 ? "🔵 Vous êtes le joueur 1" : "🔴 Vous êtes le joueur 2"}
        </Text>
      )}

      <Button title="Rejoindre la file" onPress={joinQueue} />
      <Button title="Quitter la file" onPress={leaveQueue} color="red" />
    </View>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  roomText: {
    fontSize: 18,
    color: "green",
    marginBottom: 10,
  },
  waitingText: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  playerText: {
    fontSize: 16,
    color: "blue",
    marginBottom: 10,
  },
});
