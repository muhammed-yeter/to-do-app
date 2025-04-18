const theme = {
    light: {
        theme: "light",

        primaryText: {
            color: "#232946",
        },

        secondaryText: {
            color: "#7F7C99",
        },

        interactItem: {
            backgroundColor: "#6255D3",
        },

    
        bgColor1: {
            backgroundColor: "#ECEAFF",
        },

    
        bgColor2: {
            backgroundColor: "#D7D5F2",
        },

    
        bgColor3: {
            backgroundColor: "#F5F5FF",
        },

    
        bgColor4: {
            backgroundColor: "#D7D5F250"
        },

        soonMenuItemRound: {
            borderColor: "#6255D3",
        },

        calendarMonth: {
            color: "#8B78E6",
        },

        calendarDisabled: {
            color: "#B3B3C6",
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
            color: "#C6C3E0",
        },

        interactItem: {
            backgroundColor: "#6255D3",
        },

        bgColor1: {
            backgroundColor: "#2D2B3F",
        },

        bgColor2: {
            backgroundColor: "#1E1C2B",
        },

        bgColor3: {
            backgroundColor: "#14121F",
        },

        bgColor4: {
            backgroundColor: "#2D2B3F50",
        },

        soonMenuItemRound: {
            borderColor: "#8A80C7",
        },

        calendarMonth: {
            color: "#CFCBFF",
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
                textColor: "#232946"
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