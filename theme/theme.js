const theme = {
    light: {
        theme: "light",
        //açık renk paleti
        primaryText: {
            color: "#1e0036ff",
        },

        secondaryText: {
            color: "#7a7795",
        },

        interactItem: {
            backgroundColor: "#6255D3",
        },

        //Açıktan Koyuya

        //interact
        bgColor1: {
            backgroundColor: "#dcdbf3",
        },

        //footer
        bgColor2: {
            backgroundColor: "#bbbacf",
        },

        //bg
        bgColor3: {
            backgroundColor: "#f2f1fa",
        },

        soonMenuItemRound: {
            borderColor: "black",
        },

        calendarMonth: {
            color: "#9B72FF",
        },

        calendarDisabled: {
            color: "#999999",
        },
    },

    dark: {
        theme: "dark",

        //koyu renk paleti
        primaryText: {
            color: "#fff",
        },

        secondaryText: {
            color: "#C0C0C0",
        },

        interactItem: {
            backgroundColor: "#6255D3",
        },

        //Koyudan Açığa
        bgColor1: {
            backgroundColor: "#363636",
        },

        bgColor2: {
            backgroundColor: "#202020",
        },

        bgColor3: {
            backgroundColor: "#121212",
        },


        soonMenuItemRound: {
            borderColor: "white",
        },

        calendarMonth: {
            color: "#DBD6FF",
        },

        calendarDisabled: {
            color: "#666666",
        },
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