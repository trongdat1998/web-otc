export default `.tran(@p: all, @t: 0.5s, @f: ease) {
  -webkit-transition: @p @t @f;
  -moz-transition: @p @t @f;
  -o-transition: @p @t @f;
  transition: @p @t @f;
}

.colorcard(@className, @color) {

  .color-@{className},
  .hover-@{className}:hover,
  .holder-@{className}::placeholder {
      color: @color;
  }

  .bg-@{className},
  .hoverbg-@{className}:hover {
      background: @color  !important
  }

  .after-@{className}:after {
      background-image: radial-gradient(circle, @color 10%, transparent 10.01%)
  }

  .borderleft-@{className} {
      border-left-color: @color;
  }

  .border-@{className} {
      border-color: @color;
  }

}

html,
body {
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  color: @common-contrastText;
  -webkit-font-smoothing: subpixel-antialiased;
}


a {
  .tran;

  &:hover {
      color: @primary-main;
  }
}

/*
* primary
*/

.colorcard(primary-main, @primary-main);
.colorcard(primary-light, @primary-light);
.colorcard(primary-dark, @primary-dark);
.colorcard(primary-text, @primary-contrastText);

/*
* secondary
*/

.colorcard(secondary-main, @secondary-main);
.colorcard(secondary-light, @secondary-light);
.colorcard(secondary-dark, @secondary-dark);
.colorcard(secondary-text, @secondary-contrastText);

/*
* error
*/

.colorcard(error-main, @error-main);
.colorcard(error-light, @error-light);
.colorcard(error-dark, @error-dark);
.colorcard(error-text, @error-contrastText);

/*
* common
*/
.colorcard(common-text, @common-contrastText);
.colorcard(common-surface, @common-surface);
.colorcard(common-background, @common-background);

/*
* success
*/

.colorcard(success-main, @success-main);
.colorcard(success-light, @success-light);
.colorcard(success-dark, @success-dark);
.colorcard(success-text, @success-contrastText);

/*
* grey
*/
.colorcard(grey-800, @grey-800);
.colorcard(grey-500, @grey-500);
.colorcard(grey-200, @grey-200);
.colorcard(grey-100, @grey-100);
.colorcard(grey-50, @grey-50);

/*
* primary
*/

.colorcard(default-main, @grey-100);
.colorcard(default-light, @grey-50);
.colorcard(default-dark, @grey-200);
.colorcard(default-text, @common-contrastText);

.colorcard(black-800, @black-800);

.router-link-active {
  color: @primary-main;
}

.ivu-table{
  font-size: 12px;
  &-cell{
    padding-left:0;
    padding-right:0
  }
  td{
      height: 56px;
  }
  th{
      height: 56px !important;
      background: @common-background;
      font-weight: 400;
      color:@grey-500;
  }

  &-row-hover td{
    background:@common-background !important;
  }
}

.ivu-dropdown-item {
  min-width: 100px;
  line-height: 26px;
  font-size: 16px !important;
  color: @common-contrastText;

  &:hover {
      background: @grey-50;
      color: @primary-main;
  }
}

.ivu-select-single .ivu-select-selection {
  background: none;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid @grey-200;
  box-shadow: none;

  &.ivu-select-selection-focused {
      border-bottom: 1px solid @primary-main;
      background: none;
  }


  .ivu-select-selected-value,
  .ivu-select-placeholder {
      padding-left: 0;
      color: @common-contrastText;
      font-size: 14px;
  }

  .ivu-select-placeholder {
      color: @grey-500;
  }

  .ivu-select-arrow {
      right: 0;
      color: @common-contrastText;
  }
}

.ivu-select-dropdown {

  .ivu-select-item-selected,
  .ivu-select-item-selected:hover {
      color: @primary-main;
  }

  .ivu-select-item-focus {
      background: none;
  }
}

.ivu-select-black .ivu-select-selection {
  border-bottom: 1px solid @common-contrastText;
}

/*
* Font Size
*/
.Display5 {
  letter-spacing: -0.015em;
  font-size: 96px;
  font-weight: 300;
}

.Display4 {
  letter-spacing: -0.005em;
  font-size: 60px;
  font-weight: 300;
}

.Display3 {
  font-size: 48px;
}

.Display2 {
  letter-spacing: 0.0025em;
  font-size: 34px;
}

.Display1 {
  font-size: 24px;
}

.Heading {
  letter-spacing: 0.0015em;
  font-size: 20px;
  font-weight: 700;
}

.Subtitle1 {
  letter-spacing: 0.0015em;
  font-size: 16px;
  font-weight: 700;
}

.Subtitle2 {
  letter-spacing: 0.001em;
  font-size: 14px;
  font-weight: 700;
}

.Body1 {
  letter-spacing: 0.005em;
  font-size: 16px;
}

.Body2 {
  letter-spacing: 0.0025em;
  font-size: 14px;
}

.Caption {
  letter-spacing: 0.004em;
  font-size: 12px;
}

.Button {
  font-size: 14px;
  font-weight: 700;
}

/*
* shadow
*/

.Shadow1 {
  box-shadow: 0px 1px 2px rgba(36, 43, 50, 0.2), 0px 0px 2px rgba(36, 43, 50, 0.12), 0px 0px 2px rgba(36, 43, 50, 0.14);
}

.Shadow2 {
  box-shadow: 0px 1px 5px rgba(36, 43, 50, 0.2), 0px 3px 4px rgba(36, 43, 50, 0.12), 0px 2px 4px rgba(36, 43, 50, 0.14);
}

.Shadow3 {
  box-shadow: 0px 1px 8px rgba(36, 43, 50, 0.2), 0px 3px 4px rgba(36, 43, 50, 0.12), 0px 3px 3px rgba(36, 43, 50, 0.14);
}

.Shadow6 {
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 18px rgba(0, 0, 0, 0.12), 0px 6px 10px rgba(0, 0, 0, 0.14);
}




#main {
  width: 100%;
  min-width: 1280px;
  .broker-preview-mode{
    text-align:center;
    line-height:30px
  }

  .broker-container  {
    min-width: 1280px;
    max-width: 1328px;
    margin: 0 auto;
    padding: 0 56px;
    min-height: calc(100vh - 286px);
    overflow: hidden;
  }
  .broker-main {
    min-height: 100vh;
  }
  .broker-space{
    display:inline-block;
    padding:0 5px;
    &:before{
      content:" "
    }
  }
}


.Bold {
  font-weight: bold
}

.ivu-badge-count {
  top: 0;
  height: 18px;
  line-height: 18px;
  min-width: 18px;
  padding: 0 5px;
}

.ivu-dropdown-menu {
  padding: 12px 0;
  border-radius: 4px;
}

.ivu-poptip-inner {
  .Shadow3
}






`