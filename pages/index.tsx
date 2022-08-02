// import BoatCustomizator from "@component/BoatCustomziator";
import dynamic from "next/dynamic";
import Head from 'next/head'
const BoatCustomizator = dynamic(() => import("@component/BoatCustomziator"), {
  ssr: false,
});

export default function Page() {
  return (
    <>
          <Head> 
        <title>My page title</title>
        
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/js/all.min.js" integrity="sha512-6PM0qYu5KExuNcKt5bURAoT6KCThUmHRewN3zUFNaoI6Di7XJPTMoT6K0nsagZKk2OB4L7E3q1uQKHNHd4stIQ==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>
      </Head>
    <BoatCustomizator
      config={{
        envMapPath: "./env_map.exr",
        modelPath: "./boat.zip",
        mapPath: "./base_color.jpg",
        metallnessMapPath: "./met.jpg",
        occlusionRoughnessMetallicMapPath: "./map.jpg",
        transparentParts: {
          console_glass: 0.5,
          second_station_glass: 0.5,
        },
        customization: {
          placeholder_inner_upholstery: {
            placeholderLabel: "upholstery",
            styleCustomization: [
              {
                targetParts: [/upholstery_inner/],
                label: "inner upholstery",
                options: [
                  { type: "color", value: "#d2e9e4" },
                  { type: "color", value: "#57a1bd", default: true },
                  { type: "color", value: "#f7dea2" },
                  { type: "color", value: "#0b0706" },
                ],
              },
              {
                targetParts: [/upholstery_outer/],
                label: "outer upholstery",
                options: [
                  { type: "color", value: "#d2e9e4" },
                  { type: "color", value: "#57a1bd" },
                  { type: "color", value: "#f7dea2", default: true },
                  { type: "color", value: "#0b0706" },
                ],
              },
            ],
          },
          placeholder_hull_bottom: {
            placeholderLabel: "Hull",
            visibilityCustomization: [
              {
                options: [
                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/deeb_vee_notched_171915/],
                    default: true,
                  },
                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/deeb_vee_notched_211919/],
                    default: true,
                  },
                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/deeb_vee_notched_211950/],
                    default: true,
                  },
                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/deeb_vee_notched_261919/],
                    default: true,
                  },
                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/deeb_vee_notched_R81618/],
                    default: true,
                  },
                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/deeb_vee_notched_R121922/],
                    default: true,
                  },






                   {
                     imageURL: "/part_renders/deebVeeFull.png",
                     targetParts: [/deeb_vee_full_171915/],
                     default: false,
                   },
                   {
                    imageURL: "/part_renders/deebVeeFull.png",
                    targetParts: [/deeb_vee_full_211919/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/deebVeeFull.png",
                    targetParts: [/deeb_vee_full_211950/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/deebVeeFull.png",
                    targetParts: [/deeb_vee_full_261919/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/deebVeeFull.png",
                    targetParts: [/deeb_vee_full_R81618/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/deebVeeFull.png",
                    targetParts: [/_deeb_vee_full_R121922/],
                    default: false,
                  },







                  {
                     imageURL: "/part_renders/deebVeeRubrail.png",
                     targetParts: [/deeb_vee_rubrail_171915/],
                     default: false,
                  },
                  
                  {
                    imageURL: "/part_renders/deebVeeRubrail.png",
                    targetParts: [/deeb_vee_rubrail_211919/],
                    default: false,
                 },
                 
                 {
                  imageURL: "/part_renders/deebVeeRubrail.png",
                  targetParts: [/deeb_vee_rubrail_211950/],
                  default: false,
               },
               
               {
                imageURL: "/part_renders/deebVeeRubrail.png",
                targetParts: [/deeb_vee_rubrail_261919/],
                default: false,
             },
             
             {
              imageURL: "/part_renders/deebVeeRubrail.png",
              targetParts: [/deeb_vee_rubrail_R81618/],
              default: false,
           },
           
           {
            imageURL: "/part_renders/deebVeeRubrail.png",
            targetParts: [/deeb_vee_rubrail_R121922/],
            default: false,
         },









                  // {
                  //   imageURL: "/part_renders/deebVeeFull.png",
                  //   targetParts: [/deeb_vee_full/],
                  //   default: false,
                  // },
                  // {
                  //   imageURL: "/part_renders/deebVeeRubrail.png",
                  //   targetParts: [/deeb_vee_rubrail/],
                  //   default: false,
                  // },

                  


                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_notched_171919/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_notched_211919/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_notched_211950/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_notched_261919/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_notched_R81618/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_notched_R121922/],
                    default: false,
                  },



                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_full_171919/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_full_211919/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_full_211950/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_full_261919/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_full_R81618/],
                    default: false,
                  },
                  {
                    imageURL: "/part_renders/flatFull.png",
                    targetParts: [/flat_full_R121922/],
                    default: false,
                  },


                  {
                    imageURL: "/part_renders/flatRubrail.png",
                    targetParts: [/flat_rubrail_171919/],
                    default: false,
                  },                  {
                    imageURL: "/part_renders/flatRubrail.png",
                    targetParts: [/flat_rubrail_211919/],
                    default: false,
                  },                  {
                    imageURL: "/part_renders/flatRubrail.png",
                    targetParts: [/flat_rubrail_211950/],
                    default: false,
                  },                  {
                    imageURL: "/part_renders/flatRubrail.png",
                    targetParts: [/flat_rubrail_261919/],
                    default: false,
                  },                  {
                    imageURL: "/part_renders/flatRubrail.png",
                    targetParts: [/flat_rubrail_R81618/],
                    default: false,
                  },                  {
                    imageURL: "/part_renders/flatRubrail.png",
                    targetParts: [/flat_rubrail_R121922/],
                    default: false,
                  },














                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/catamaran_171915/],
                    default: true,
                  },
                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/catamaran_211919/],
                    default: true,
                  },
                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/catamaran_261919/],
                    default: true,
                  },
                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/catamaran_R81618/],
                    default: true,
                  },
                  {
                    imageURL: "/part_renders/deebVeeNotch.png",
                    targetParts: [/catamaran_R121922/],
                    default: true,
                  },



                  
                ],
              },
            ],
            // styleCustomization: [
            //   {
            //     targetParts: [/hull_bottom/],
            //     label: "Hull Bottom",
            //     options: [
            //       { type: "color", value: "#ffffff" },
            //       { type: "color", value: "#90dfd1" },
            //       { type: "color", value: "#57a1bd", default: true },
            //       { type: "color", value: "#001a33" },
            //       { type: "color", value: "#c1c7ca" },
            //     ],
            //   },
            //   {
            //     targetParts: [/hull_side/],
            //     label: "Hull Sides",
            //     options: [
            //       { type: "color", value: "#ffffff" },
            //       { type: "color", value: "#90dfd1", default: true },
            //       { type: "color", value: "#57a1bd" },
            //       { type: "color", value: "#001a33" },
            //       { type: "color", value: "#c1c7ca" },
            //     ],
            //   },
            // ],
          },
          placeholder_rubrail_inner: {
            placeholderLabel: "Rubrail",
            styleCustomization: [
              {
                targetParts: [/rubrail_inner/],

                label: "Rubrail Inner",
                options: [
                  { type: "color", value: "#000000" },
                  { type: "color", value: "#ffffff", default: true },
                ],
              },
              {
                targetParts: [/rubrail_outer/],
                label: "Rubrail Outer",
                options: [
                  { type: "color", value: "#000000", default: true },
                  { type: "color", value: "#ffffff" },
                ],
              },
            ],
          },
          placeholder_pipework: {
            placeholderLabel: "Pipework",
            styleCustomization: [
              {
                targetParts: [/pipework/],
                label: "pipework",
                options: [
                  { type: "color", value: "#ffffff" },
                  { type: "color", value: "#646464" },
                  { type: "color", value: "#000000" },
                  { type: "color", value: "#e4ebee", default: true },
                ],
              },
            ],
          },
          placeholder_leaning_post: {
            placeholderLabel: "Leaning post",
            visibilityCustomization: [
              {
                options: [
                  {
                    imageURL: "/part_renders/livewell.png",
                    targetParts: [/^live_well/],
                    default: true
                  },
                  {
                    imageURL: "/part_renders/rocket launcher.png",
                    targetParts: [/^rocket_launcher/],
                  },
                ],
              },
            ],
          },
          placeholder_t_tops: {
            placeholderLabel: "T tops",
            visibilityCustomization: [
              {
                options: [
                  {
                    imageURL: "/part_renders/keywest.png",
                    targetParts: [/^key_west/, "console_glass"],
                    default: true,
                  },
                  {
                    imageURL: "/part_renders/basetop.png",
                    targetParts: [/^hard_top/, "console_glass"],
                  },
                  {
                    imageURL: "/part_renders/top soft.png",
                    targetParts: [/^soft_top/, "console_glass"],
                  },
                  {
                    imageURL: "/part_renders/top second.png",
                    targetParts: [/^second_station/],
                  },
                ],
              },
            ],
          },
          placeholder_engine: {
            placeholderLabel: "Engine",
            visibilityCustomization: [
              {
                options: [
                  {
                    imageURL: "/part_renders/motor.png",
                    targetParts: [/^single_engine/],
                    default: true,
                  },
                  // {
                  //   imageURL: "/part_renders/motor2.png",
                  //   targetParts: [/^engine/],
                  //   default: true,
                  // }
                ],
              },
            ],
          },
          placeholder_up_down: {
            placeholderLabel: "up_down",
            visibilityCustomization: [
              {
                options: [
                  {
                    imageURL: "/part_renders/motor.png",
                    targetParts: [/^single_engine/],
                    default: true,
                  },
                  // {
                  //   imageURL: "/part_renders/motor2.png",
                  //   targetParts: [/^engine/],
                  //   default: true,
                  // }
                ],
              },
            ],
          },


        },
      }}
    />
    </>

  );
}
