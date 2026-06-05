import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DASHBOARD</Text>
      </View>

      {/* CARD GERAL */}
      <View style={styles.mainCard}>
        <Text style={styles.cardTitle}>
          HORAS APROVADAS (GERAL)
        </Text>

        <View style={styles.row}>
          <Text style={styles.hours}>
            50
            <Text style={styles.total}> / 180h</Text>
          </Text>

          <View style={styles.circle}>
            <Text style={styles.circleText}>
              27%
            </Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '27%' }]} />
        </View>

        <Text style={styles.remaining}>
          Faltam 130h para concluir.
        </Text>
      </View>

      {/* TÍTULO CATEGORIAS */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>
          Horas por Categoria
        </Text>
      </View>

      {/* ENSINO */}
      <View style={styles.categoryCard}>
        <Text style={styles.categoryTitle}>Ensino</Text>

        <View style={styles.row}>
          <Text style={styles.hours}>
            25<Text style={styles.total}> / 100h</Text>
          </Text>

          <View style={styles.circle}>
            <Text style={styles.circleText}>25%</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '25%' }]} />
        </View>

        <Text style={styles.remaining}>
          Faltam 75h para concluir.
        </Text>
      </View>

      {/* EXTENSÃO */}
      <View style={styles.categoryCard}>
        <Text style={styles.categoryTitle}>Extensão</Text>

        <View style={styles.row}>
          <Text style={styles.hours}>
            15<Text style={styles.total}> / 60h</Text>
          </Text>

          <View style={styles.circle}>
            <Text style={styles.circleText}>25%</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '25%' }]} />
        </View>

        <Text style={styles.remaining}>
          Faltam 45h para concluir.
        </Text>
      </View>

      {/* PESQUISA */}
      <View style={styles.categoryCard}>
        <Text style={styles.categoryTitle}>Pesquisa</Text>

        <View style={styles.row}>
          <Text style={styles.hours}>
            10<Text style={styles.total}> / 20h</Text>
          </Text>

          <View style={styles.circle}>
            <Text style={styles.circleText}>50%</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '50%' }]} />
        </View>

        <Text style={styles.remaining}>
          Faltam 10h para concluir.
        </Text>
      </View>

      {/* ATIVIDADES */}
      <Text style={styles.sectionTitle}>
        Últimas atividades
      </Text>

      <View style={styles.activityCard}>
        <Text style={styles.activityTitle}>
          Nenhuma atividade enviada
        </Text>

        <Text style={styles.activityStatus}>
          Aguardando envio
        </Text>
      </View>

    </ScrollView>
  );
}

/* ESTILOS */
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  header: {
    backgroundColor: '#0F2557',
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#F97316',
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  mainCard: {
    backgroundColor: '#0F2557',
    margin: 10,
    borderRadius: 12,
    padding: 15,
  },

  cardTitle: {
    color: '#FFF',
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  hours: {
    color: '#FFF',
    fontSize: 26, // REDUZIDO
    fontWeight: 'bold',
  },

  total: {
    fontSize: 18, // REDUZIDO
  },

  circle: {
    width: 50, // REDUZIDO
    height: 50,
    borderWidth: 2,
    borderColor: '#f7f5f4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },

  progressBar: {
    height: 6, // REDUZIDO
    backgroundColor: '#5A6B90',
    borderRadius: 5,
    marginTop: 10,
  },

  progress: {
    width: '0%',
    height: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },

  remaining: {
    color: '#FFF',
    marginTop: 6,
    fontSize: 12, // REDUZIDO
  },

  sectionTitleContainer: {
    marginTop: 15,
    marginHorizontal: 10,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F2557',
    margin: 15,
  },

  categoryCard: {
    backgroundColor: '#0d2b3f',
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 10,
    padding: 10, // REDUZIDO
  },

  categoryTitle: {
    color: '#FFF',
    fontSize: 14, // REDUZIDO
    fontWeight: 'bold',
    marginBottom: 6,
  },

  activityCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },

  activityTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },

  activityStatus: {
    marginTop: 5,
    color: '#F97316',
    fontWeight: 'bold',
  },
});