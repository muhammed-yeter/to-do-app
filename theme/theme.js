const theme = {
    light: {
        theme: "light",

        primaryText: {
            color: "#232946", // Koyu mor-gri yazı
        },

        secondaryText: {
            color: "#7F7C99", // Daha soft gri-mor
        },

        interactItem: {
            backgroundColor: "#6255D3", // Ana renk
        },

        // Kart arka planı gibi alanlar için açık mor tonları
        bgColor1: {
            backgroundColor: "#ECEAFF", // Hafif morumsu açık gri
        },

        // Footer, navbar altı vb.
        bgColor2: {
            backgroundColor: "#D7D5F2", // Daha uyumlu, soft bir alt ton
        },

        // Genel sayfa arka planı
        bgColor3: {
            backgroundColor: "#F5F5FF", // Nötr-morumsu açık ton
        },

        // Pasif görev kartları
        bgColor4: {
            backgroundColor: "#D7D5F250" // Şeffaf pastel gri-mor
        },

        soonMenuItemRound: {
            borderColor: "#6255D3", // Ana renkten kenarlık
        },

        calendarMonth: {
            color: "#8B78E6", // Ana renge yakın ama daha yumuşak
        },

        calendarDisabled: {
            color: "#B3B3C6", // Yumuşak gri tonu
        },

        priorityColors: {
            routine: {
                backgroundColor: "#6FCF97",
                textColor: "#232946"
            },
            important: {
                backgroundColor: "#F2C94C",
                textColor: "#232946"
            },
            primary: {
                backgroundColor: "#EB5757",
                textColor: "#fff"
            }
        }
    },


    dark: {
        theme: "dark",

        primaryText: {
            color: "#FFFFFF",
        },

        secondaryText: {
            color: "#C6C3E0", // Mor-gri uyumlu ton
        },

        interactItem: {
            backgroundColor: "#6255D3", // Ana renk
        },

        bgColor1: {
            backgroundColor: "#2D2B3F", // Hafif morumsu koyu gri
        },

        bgColor2: {
            backgroundColor: "#1E1C2B", // Footer altı gibi
        },

        bgColor3: {
            backgroundColor: "#14121F", // En karanlık arka plan
        },

        bgColor4: {
            backgroundColor: "#2D2B3F50",
        },

        soonMenuItemRound: {
            borderColor: "#8A80C7", // Açık morumsu kenarlık
        },

        calendarMonth: {
            color: "#CFCBFF", // Parlak ama göz yormayan açık mor
        },

        calendarDisabled: {
            color: "#777593",
        },


        priorityColors: {
            routine: {
                backgroundColor: "#1ABC9C",
                textColor: "#fff"
            },
            important: {
                backgroundColor: "#FFD36B",
                textColor: "#EB5757" // Mor temayla uyumlu koyu yazı
            },
            primary: {
                backgroundColor: "#FF7676",
                textColor: "#fff"
            }
        }

    }

}

export default theme;

//tema sisteminin çalışması için tüm sitelere bunlar eklenmeli
// import React, { useState, useContext } from 'react';
// import themeContext from '../../theme/themeContext';

//-----------------------------------------------------------------------------------

//tema sisteminin çalışması için tüm sitelerin ana tanımının içine bu eklenmeli
// const theme = useContext(themeContext);

//-----------------------------------------------------------------------------------


//kullanım :
//-------------

//elementlere özgü stil için
// button: {
//     backgroundColor: "orange",
//     color: "black"
// }

//-------------

//site içi
//style={[styles.container, {backgroundColor: theme.backgroundColor}]}
//style={[styles.button, {backgroundColor: theme.button.backgroundColor}]}