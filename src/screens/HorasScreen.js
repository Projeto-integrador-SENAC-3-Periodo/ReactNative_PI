import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function HorasScreen() {
  const [filtro, setFiltro] = useState('todos');

  const atividades = [
    {
      id: 1,
      title: 'Curso de React Avançado',
      subtitle: 'Curso • 12/05/2026',
      status: 'aprovada',
      label: 'Aprovada',
      hours: '40h',
    },
    {
      id: 2,
      title: 'Palestra UX e Acessibilidade',
      subtitle: 'Palestra • 08/05/2026',
      status: 'analise',
      label: 'Em análise',
      hours: '4h',
    },
    {
      id: 3,
      title: 'Voluntariado Comunitário',
      subtitle: 'Atividade • 29/04/2026',
      status: 'aprovada',
      label: 'Aprovada',
      hours: '20h',
    },
    {
      id: 4,
      title: 'Workshop de Inovação',
      subtitle: 'Curso • 20/04/2026',
      status: 'recusada',
      label: 'Recusada',
      hours: '6h',
    },
  ];

  const filtradas =
    filtro === 'todos'
      ? atividades
      : atividades.filter((item) => item.status === filtro);

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>

      {/* HEADER */}
      <View
        style={{
          backgroundColor: '#0F2A56',
          paddingTop: 60,
          paddingBottom: 15,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#FFF',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          ACOMPANHAMENTO
        </Text>
      </View>

      {/* CARD PROGRESSO */}
      <View
        style={{
          backgroundColor: '#102C5B',
          margin: 10,
          borderRadius: 10,
          padding: 12,
        }}
      >
        <Text
          style={{
            color: '#FFF',
            fontSize: 12,
            marginBottom: 8,
          }}
        >
          HORAS CONCLUÍDAS
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFF',
              fontSize: 28,
              fontWeight: 'bold',
            }}
          >
            65% <Text style={{ fontSize: 14 }}>/ 100h</Text>
          </Text>

          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 3,
              borderColor: '#F37021',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
              65%
            </Text>
          </View>
        </View>

        <View
          style={{
            height: 6,
            backgroundColor: '#5A6B88',
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <View
            style={{
              width: '65%',
              height: 6,
              backgroundColor: '#F37021',
              borderRadius: 5,
            }}
          />
        </View>

        <Text
          style={{
            color: '#FFF',
            fontSize: 11,
            marginTop: 6,
          }}
        >
          Faltam 35h para concluir
        </Text>
      </View>

      {/* 🔥 FILTROS LADO A LADO */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        {['todos', 'aprovada', 'analise', 'recusada'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFiltro(item)}
            style={{
              width: 95,
              height: 32,
              borderRadius: 16,
              marginRight: 8,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                filtro === item ? '#F37021' : '#E5E7EB',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '500' }}>
              {item === 'todos'
                ? 'Todos'
                : item === 'aprovada'
                ? 'Aprovadas'
                : item === 'analise'
                ? 'Análise'
                : 'Recusadas'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LISTA */}
      <ScrollView>
        {filtradas.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: '#FFF',
              marginHorizontal: 10,
              marginBottom: 8,
              padding: 12,
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderLeftWidth: 4,
              borderLeftColor:
                item.status === 'aprovada'
                  ? '#10B981'
                  : item.status === 'analise'
                  ? '#F59E0B'
                  : '#EF4444',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  fontSize: 11,
                  color: '#666',
                }}
              >
                {item.subtitle}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  fontWeight: '600',
                  color:
                    item.status === 'aprovada'
                      ? '#10B981'
                      : item.status === 'analise'
                      ? '#F59E0B'
                      : '#EF4444',
                }}
              >
                {item.label}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#0F2A56',
              }}
            >
              {item.hours}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}