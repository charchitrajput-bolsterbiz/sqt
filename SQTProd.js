const ORG_ID = "605643";
function getNodeStep() {
  const $stepTag = document.querySelector(".zingtree-node.tag");
  const classes = $stepTag?.classList || [];
  let step = 3;
  if ([...classes].includes("tag_WITHDRAWL_STEP")) {
    return lastStepIndex;
  }
  for (let className of classes) {
    const match = className.match(/^tag_STEP_(\d+)$/);
    if (match) {
      step = parseInt(match[1], 10);
      lastStepIndex = step;
      return step;
    }
  }
  return step;
}
const evidenceTypeToIdMap = {
  proof_of_barring: 1,
  find_my_device: 2,
  google_timeline: 3,
  purchase_receipts: 4,
  travel_receipts: 5,
  bank_statement: 6,
  reporting_of_loss_when_identified: 7,
  proof_of_calls_made_to_the_lost_device: 8,
  crime_reference_number: 9,
};
function getEvidenceTypeById(idNumber) {
  const id = Number(idNumber);
  if (isNaN(id)) return null;
  for (const [key, value] of Object.entries(evidenceTypeToIdMap)) {
    if (value === id) {
      return key;
    }
  }
  return null;
}
const tooltipsContentForEvidencePage = {
  proof_of_barring: `<div class="tooltip-content"><p>You’ll need to contact Three UK to obtain your proof of barring & usage. Watch the following video for guidance on how to do this: </p> </br>
                    </br> <a href='https://www.youtube.com/watch?v=G3ZdyIOJgVg'
                    target='_blank' >Video: How to get proof of barring</a></div>`,
  find_my_device: `<div class="tooltip-content"><p>For help on how to screenshot ‘Find My’ from a desktop computer watch one of the following videos: </p>
                    <ul style="padding-left:10px">
                      <li>For iPhone/ iOS device claims – watch <a href='https://www.youtube.com/watch?v=ncqjWr7h4_g&list=PLodHfVxlRXi9-kB4C6su67LgMYFn1frhL' target='_blank'>here</a></li>
                      <li>For Android device claims – watch <a href='https://www.youtube.com/watch?v=X5xiG7ImX6g&list=PLodHfVxlRXi9-kB4C6su67LgMYFn1frhL&index=7' target='_blank'>here</a></li>
                    </ul></div>`,
  google_timeline: `<div class="tooltip-content"><p>Click <a href="https://support.google.com/maps/answer/6258979?hl=en&co=GENIE.Platform%3DDesktop" target="_blank">here</a> for information on how to access your Google Timeline.</p> </br>
                      <p>You will need to select the date your device was lost or stolen and include a screenshot of the timeline on this date. Even if the timeline is blank, please send a screenshot showing the timeline.</p></div>`,
  other_supporting_evidence: `<div class="tooltip-content"><p>Other supporting evidence is required to show proof of location. This can be a photo of a purchase receipt, travel receipt or bank statement.</p>
                                <p>Please ensure we can clearly see all the details of the transaction including date, time and location.</p></div>`,
  purchase_receipts: `<div class="tooltip-content"><p>If you made a purchase around the time of the incident, attach an image of those
                        receipts. Please ensure we can clearly see all the details of the transaction including
                        date, time and location.</p></div>`,
  travel_receipts: `<div class="tooltip-content"><p>Attach an image of any travel receipts (e.g. bus, train, taxi) from around the time of
                      the incident. Please ensure we can clearly see all the details of your journey
                      including date, time, location and details of travel provider.</p></div>`,
  bank_statement: `<div class="tooltip-content"><p>If you made a purchase around the time of the incident, attach a screenshot of the
                      transaction from your banking app or bank statement. Please ensure we can clearly
                      see all the details of the transaction you made around the time your phone was
                      discovered lost/stolen.</p></div>`,
  reporting_of_loss_when_identified: `<div class="tooltip-content"><p>Please submit full details of correspondence from when you reported your device
                                            lost/missing to attempt to retrieve your device. This should include the date &amp; time,
                                            details of recipient and loss of your device. </p></br><p>
                                            For example, if you lost your phone during travel and reported this to your travel
                                            provider, they would have provided you a confirmation note.
                                         </p></div>`,
  crime_reference_number: `<div class="tooltip-content"><p>Upload an image of the
                          <a href='https://www.met.police.uk/advice/advice-and-information/crime-ref-no/crime-reference-number/'
                          target='_blank' >crime reference number</a> or police report you received when
                          reporting the theft of your device. </p></br><p>
                          If attaching an image of the police report, verify the following is visible: the reporter’s
                          name, date of report &amp; the crime reference number.</p></div>`,
  proof_of_calls_made_to_the_lost_device: `<div class="tooltip-content"><p>Please provide evidence of a call log that shows that you attempted to contact your
                          lost/stolen device. This could be screenshots of a call log from a partner’s or friend’s
                          phone near the time of the incident.</p> </br><p>
                          Please ensure we can clearly see all the details of the calls made to the lost device
                          and that the image/PDF has not been cropped.</p></div>`,
};
function checkNodeTag(nodeTag) {
  return $(`.zingtree-node.tag_${nodeTag}`).length > 0;
}
function toggleCannotProvideCtaAndCorrespondingTextAreaForUploadFields(
  label,
  isDocumentUploaded,
) {
  const $label = $(label);
  const $formField = $label.closest(".form-field-container.zt-customized");
  const $cannotProvideCtaButton = $formField.find(".cannot-provide-cta");
  const $cannotProvideCommentsBox = $formField.siblings(".upload-comments-box");
  if (isDocumentUploaded) {
    $cannotProvideCtaButton.hide();
    const textAreaName = $cannotProvideCommentsBox
      .find("textarea.v-field__input")
      .attr("name");
    $cannotProvideCommentsBox.hide();
    window.form_data[textAreaName] && assignSessionVar(textAreaName, "");
  } else {
    $cannotProvideCtaButton.show();
  }
}
function getUploadedDocumentDeleteContainer(uploadedDocument) {
  const documentName = uploadedDocument.documentName;
  const documentId = uploadedDocument.documentId;
  const rfiId = uploadedDocument.rfiId;
  const $uploadBody = $("<div>", {
    class: "zt-upload-body",
    css: { lineBreak: "anywhere" },
  });
  const $docName = $("<span>", {
    text: documentName,
    css: { color: "#0a1f44", fontWeight: "500", textDecoration: "underline" },
  });
  const $deleteImg = $("<img>", {
    src: "https://assets.zingtree.com/managed/squaretrade/claims_validation/icons/bin.png",
    alt: "Delete",
    class: "delete-evidence",
    "data-document-id": documentId,
    "data-rfi-id": rfiId,
    css: { width: "18px", height: "18px", cursor: "pointer" },
  });
  $deleteImg.on("click", function () {
    const $deleteIcon = $(this);
    const documentId = $deleteIcon.attr("data-document-id");
    const rfiId = $deleteIcon.attr("data-rfi-id");
    assignSessionVar("document_id", documentId);
    assignSessionVar("rfi_id", rfiId);
    const $currentRow = $(this).closest(".zt-upload-body");
    const $container = $currentRow.closest(".form-field-container");
    $currentRow.remove();
    const remainingDocs = $container.find(
      ".uploaded-documents-container .zt-upload-body",
    ).length;
    const $uploadBtn = $container.find(
      '[data-upload-role="primary-upload-btn"]',
    );
    if (remainingDocs < 3 && $uploadBtn.length) {
      $uploadBtn.prop("disabled", !1);
      $uploadBtn.css("pointer-events", "auto").css("opacity", "1");
    }
    setTimeout(() => {
      do_button_click(36);
    }, 300);
  });
  $uploadBody.append($docName, $deleteImg);
  return $uploadBody.get(0);
}
function getUploadedDocumentDeleteContainerWrapper(uploadedDocumentsArray) {
  const $uploadedDocumentsContainer = $("<div>", {
    class: "uploaded-documents-container",
  });
  uploadedDocumentsArray.forEach((uploadedDocument) => {
    $uploadedDocumentsContainer.append(
      $(getUploadedDocumentDeleteContainer(uploadedDocument)),
    );
  });
  return $uploadedDocumentsContainer.get(0);
}
function mountUploadedDocumentsWrapper(
  labelHtmlContainer,
  uploadedDocumentsArray,
) {
  const labelParent = labelHtmlContainer.closest("div");
  const alreadyMountedDeletedDocumentsContainer = !!labelParent.querySelector(
    ":scope > .uploaded-documents-container",
  );
  if (!alreadyMountedDeletedDocumentsContainer) {
    labelParent.appendChild(
      getUploadedDocumentDeleteContainerWrapper(uploadedDocumentsArray),
    );
  }
}
function createModalHTML(modalId) {
  return `
                    <div class="modal fade" id="${modalId}" tabindex="-1">
                      <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
      "
    >

                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title">Upload</h5>
                              <button type="button" class="close" id="${modalId}_closeBtn" data-dismiss="modal"><span>×</span></button>
                            </div>
                            <div class="modal-body text-center">
                              <input type="file" style="display:none" id="${modalId}_fileInput" />
                              <div style="border: 1px dashed #ccc; padding: 20px; border-radius: 8px;">
                                <div id="${modalId}_dropzone" style="display: flex; flex-direction: column; align-items: center;">
                                    <img src="https://assets.zingtree.com/managed/squaretrade/claims_validation/icons/upload.png" alt="Upload" style="margin-bottom: 10px; width: 30px; height: 30px;" id="${modalId}_icon">
                                    <button type="button" class="zt-upload-btn mt-2" id="${modalId}_attachBtn">Attach document</button>
                                    <p id="${modalId}_fileError" style="color: red; font-size: 13px; display: none; margin-top: 8px;"></p>
                                </div>
                                <div id="${modalId}_filePreview" class="file-preview-modal-file-info" style="display:none; margin-top:10px;">
                                    <img src="https://assets.zingtree.com/managed/squaretrade/claims_validation/icons/PDF.png" style="width: 30px; height: 30px;" alt="PDF">
                                    </br>
                                    <img src="https://assets.zingtree.com/managed/squaretrade/claims_validation/icons/tick.png" style="width: 15px; height: 15px;" alt="tick">
                                    <div style="font-weight: 500;" id="${modalId}_fileName"></div>
                                    <div style="font-size: 12px; color: #999;" id="${modalId}_fileSize"></div>
                                </div>
                            </div>

                              <p class="mt-3 url-link-text">Or add in a URL link below</p>
                              <div style="display: flex; gap: 10px; align-items: center; margin-top: 8px;">
                                <input class="form-control" type="text" placeholder="https://example.com/doc.pdf" style="width: 70%;" id="${modalId}_url">
                                <button class="btn btn-secondary" style="width: 30%;" id="${modalId}_uploadUrlBtn" disabled>Upload</button>
                              </div>

                              <div style="margin-top: 20px; text-align: center;">
                                <button class="zt-upload-btn mt-3" id="${modalId}_confirmAttach" style="display:none;">Attach</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                      </div>
                  `;
}
let currentStepIndex = -1;
let firstUploadModalId = "ztFallbackUploadModal";
if (!document.getElementById(firstUploadModalId)) {
  document.body.insertAdjacentHTML(
    "beforeend",
    createModalHTML(firstUploadModalId),
  );
}
let updateTimeout;
const observer = new MutationObserver(() => {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    const activeNode = document.querySelector(
      ".zingtree-node:not([style*='display: none'])",
    );
    const isFirstNode = activeNode?.classList.contains("tag_STARTNODE") || !1;
    injectDynamicBackground(isFirstNode);
    const previewBanner = document.querySelector(".preview-banner");
    const previewContainer = document.querySelector(".preview-all");
    const existingProgress = document.querySelector(".zt-progress-lines");
    const existingStyle = document.getElementById("zt-style-custom-node");
    const titleRow = document.querySelector(".button-node-title");
    const existingTopLogo = document.querySelector(".zt-top-logo");
    const persistentCustomButtons = document.querySelectorAll(
      '[data-test="zt-persistent-button"]',
    );
    const persistentButtonsWrapper = document.querySelector(
      ".persistent-buttons",
    );
    if (!previewContainer) return;
    if (persistentButtonsWrapper) {
      persistentCustomButtons.forEach((btn) => {
        btn.style.display = isFirstNode ? "none" : "";
      });
      persistentButtonsWrapper.style.backgroundColor = isFirstNode
        ? "transparent"
        : "#fff";
    }
    if (isFirstNode) {
      const isMediumUp = window.innerWidth >= 768;
      const firstNodeStyle = document.createElement("style");
      firstNodeStyle.id = "zt-style-first-node-input";
      firstNodeStyle.innerHTML = `
                              ${
                                isMediumUp
                                  ? `.zingtree-node.tag_STARTNODE.button-node-title strong,.zingtree-node.tag_STARTNODE.content-node-html,.zingtree-node.tag_STARTNODE.v-label{color:#0033a0!important}.zt-top-logo img{display:none!important}`
                                  : ""
                              }
                              `;
      document.head.appendChild(firstNodeStyle);
    }
    if (existingProgress) existingProgress.remove();
    if (!isFirstNode) {
      if (!existingStyle) {
        const style = document.createElement("style");
        style.id = "zt-style-custom-node";
        style.innerHTML = `
                          body.zingtree .button-node-content,
                          body.zingtree .panel-body.panels-node-content {
                            border: none !important;
                            color: #0F1C44 !important;
                            background-color: #fff !important;
                            margin: 1px 0.26rem 0px 0.26rem !important;
                            border-radius: 35px 35px 0px 0px;
                            padding: 4rem;
                          }

                          .v-field__input {
                            color: #0F1C44 !important;
                          }

                          [class*="col-"] {
                            padding-left: 0px;
                            padding-right: 0px;
                          }

                          .widewrapper.main.ma-4 {
                            margin: 1px !important;
                          }

                          .persistent-buttons {
                            background-color: #fff !important;
                            margin-top: -2%;
                          }

                          @media (min-width: 576px) {
                            .persistent-buttons {
                              margin-top: -4% !important;
                            }
                          }

                          @media (min-width: 768px) {
                            .container {
                              width: 100% !important;
                            }

                            .persistent-buttons {
                              margin-top: -3% !important;
                            }
                          }

                          #qa-area.well.button-node-question,
                          #qa-area.list-group.panels-node-question {
                            background-color: #fff;
                          }

                          .zt-progress-lines {
                            display: flex;
                            justify-content: center;
                            margin-top: 20px;
                            margin-bottom: 24px;
                            gap: 12px;
                          }

                          .zt-progress-line {
                            height: 3px;
                            width: 60px;
                            background-color: #aaa;
                            border-radius: 2px;
                          }

                          .zt-progress-line.active {
                            background-color: #fff;
                          }

                          .zt-upload-body {
                            position: relative;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            background: #e9f4ff;
                            border-radius: 8px;
                            padding: 10px 14px;
                            margin-top: 8px;
                          }

                          .zt-upload-btn {
                            background-color: #0033a0;
                            color: #fff;
                            padding: 10px 4rem;
                            border-radius: 4px;
                            border: none;
                            font-size: 14px;
                            cursor: pointer;
                          }



                          .zt-upload-footer {
                            margin-top: 6px;
                            margin-left: 15px;
                            font-size: 15px;
                            color: #282c33;
                            cursor: pointer;
                          }


                          .zt-upload-header img {
                            margin-left: 8px;
                            width: 16px;
                            height: 16px;
                          }

                          .zt-upload-header {
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            margin-top: 8px;
                          }

                          .v-label {
                            color: #282c33 !important;
                            font-weight: 500 !important;
                            opacity: 1 !important;
                          }
                        `;
        document.head.appendChild(style);
      }
      customizeFileInputs();
      attachAmendPopupTrigger();
      const existingStyleForFirstScreenText = document.querySelector(
        "#zt-style-custom-first-node-texts",
      );
      if (existingStyleForFirstScreenText) {
        existingStyleForFirstScreenText.remove();
      }
    } else {
      if (existingStyle) existingStyle.remove();
      currentStepIndex = -1;
      const firstNodeStyle = document.createElement("style");
      firstNodeStyle.id = "zt-style-first-node-input";
      firstNodeStyle.innerHTML = `
                          /* First node - medium and up: keep gradient */
                          @media (min-width: 768px) {
                          body.zingtree .button-node-content,
                                      body.zingtree .panel-body.panels-node-content {
                                      border: none !important;
                                      color: #0F1C44 !important;
                                      background-color: #fff !important;
                                      margin: 1px 0.21rem 0px 0.21rem !important;
                                      border-radius: 35px 35px 0px 0px;
                                      padding: 4rem;
                                      }
                              }
                          }
                          `;
      document.head.appendChild(firstNodeStyle);
      attachCheckIconOnBlur();
      validateClaimID();
      const wideWrapper = document.querySelector(".widewrapper.main");
      wideWrapper.classList.remove("ma-4");
      const rowContainer = document.querySelector("#buttonnode0 > .row");
      if (rowContainer) {
        rowContainer.style.marginLeft = "-18px";
        rowContainer.style.marginRight = "-18px";
        const cardDiv = rowContainer.querySelector(":scope > .col-md-12");
        cardDiv && (cardDiv.style.padding = "2px");
      }
      const container = previewContainer.closest(".container");
      container.classList.remove("pr-3", "pl-3");
      const firstNodeTextStyle = document.createElement("style");
      firstNodeTextStyle.id = "zt-style-custom-first-node-texts";
      firstNodeTextStyle.innerHTML = `
                    .v-input.v-text-field > .v-input__control > .v-field {
                    background-color: transparent !important;
                    }
                        @media (max-width:767px){
                            p, span{
                                color:#fff !important;
                            }
                            div.v-field__field{
                                background-color: var(--color-primary);
                            }
                                .md-screen-logo-container{
                                display:none;
                                }
                                input[type=text]{
                                color:#fff;}
                        }
                            @media (min-width:768px){
                            p, span{
                                color: #0033a0 !important;
                            }
                            a.btn-primary{
                                background-color: var(--color-primary);
                                color: #fff;
                            }
                            a.btn-primary:hover{
                            background-color: var(--color-primary);
                            color: #fff;
                            }
                            input[type=text]{
                              color:#0F1C44;
                            }
                        }
                    `;
      document.head.appendChild(firstNodeTextStyle);
    }
    if (!isFirstNode) {
      const nodeTitleRaw =
        document.querySelector("#node-title span")?.innerText.trim() || "";
      const nodeTitle = nodeTitleRaw.toLowerCase();
      let stepIndex = getNodeStep();
      if (stepIndex !== null) {
        currentStepIndex = stepIndex;
        const progress = document.createElement("div");
        progress.className = "zt-progress-lines";
        const safeStepIndex = stepIndex !== null ? stepIndex : lastStepIndex;
        const totalSteps = 4;
        for (let i = 0; i < totalSteps; i++) {
          const line = document.createElement("div");
          line.classList.add("zt-progress-line");
          if (safeStepIndex !== null && i <= safeStepIndex) {
            line.classList.add("active");
          }
          progress.appendChild(line);
        }
        if (previewBanner?.parentNode) {
          previewBanner.parentNode.insertBefore(
            progress,
            previewBanner.nextSibling,
          );
        } else {
          const container = previewContainer.closest(".container");
          if (container) {
            container.insertBefore(progress, previewContainer.closest(".pa-0"));
          }
        }
      }
    }
    const container = previewContainer.closest(".container");
    container.classList.add("pt-2", "pr-3", "pb-0", "pl-3");
    addCheckIconsToDropdown();
    enhanceDropdownInputs();
    insertWideScreenHeading();
    makeProvideDocumentationNodeDesignResponsive();
    injectWithdrawalDropdownIntoModalWithWait();
    enableSubmitOnTellUsWhatHappenedInput();
    updateNextButtonForEvidenceSections();
    updateTellUsWhatHappenedScreenBackButtonDesign();
    appendCommentsBoxToUploadFields();
    document
      .querySelectorAll(".upload-comments-box textarea")
      .forEach((textarea) => {
        if (!textarea.classList.contains("zt-listener-attached")) {
          textarea.classList.add("zt-listener-attached");
          textarea.addEventListener(
            "input",
            updateNextButtonForEvidenceSections,
          );
        }
      });
    document
      .querySelectorAll(".uploaded-documents-container")
      .forEach((container) => {
        if (!container.dataset.observerAttached) {
          const sectionObserver = new MutationObserver(
            updateNextButtonForEvidenceSections,
          );
          sectionObserver.observe(container, { childList: !0, subtree: !0 });
          container.dataset.observerAttached = "true";
        }
      });
    setTimeout(() => {
      const notePara = document.querySelector(".uploaded-doc-container");
      if (!notePara || !notePara.innerHTML) return;
      const uploadedDocuments = JSON.parse(notePara.innerHTML);
      if (
        uploadedDocuments.noNewValidInput &&
        $("#duplicate-document-error-message").length < 1
      ) {
        console.log("here");
        const duplicateUploadError = $("<p>")
          .attr("id", "duplicate-document-error-message")
          .html(
            `<span class="mdi mdi-alert-circle"></span> ${uploadedDocuments.noNewValidInput}`,
          );
        $(".v-row.content-question").after(duplicateUploadError);
      }
      const uploadedEvidenceIds = Object.keys(uploadedDocuments);
      uploadedEvidenceIds.forEach((id) => {
        const uploadedEvidenceType = Object.entries(evidenceTypeToIdMap).find(
          ([k, v]) => v == id,
        )?.[0];
        if (!uploadedEvidenceType) {
          return;
        }
        const label = document.querySelector(`#${uploadedEvidenceType}-label`);
        mountUploadedDocumentsWrapper(
          label,
          uploadedDocuments[id]?.slice(0, 3) || [],
        );
        toggleCannotProvideCtaAndCorrespondingTextAreaForUploadFields(
          label,
          uploadedDocuments[id] && !!uploadedDocuments[id][0],
        );
        setTimeout(() => {
          updateUploadButtonState(label.closest(".form-field-container"));
        }, 100);
      });
    }, 300);
    const withdrawAnchor = document.querySelector(
      '[data-test="zt-persistent-button"]:not(#ztWithdrawTrigger)',
    );
    if (withdrawAnchor) {
      withdrawAnchor.id = "ztWithdrawTrigger";
      withdrawAnchor.setAttribute("href", "#");
      withdrawAnchor.addEventListener("click", (e) => {
        const navigationHistory = getNavigationHistory();
        const previousNode = navigationHistory.at(-2);
        if (previousNode?.node_id) {
          const prevNodeElement = document.querySelector(".zingtree-node.tag");
          const prevClasses = prevNodeElement?.classList || [];
          for (let className of prevClasses) {
            const match = className.match(/^tag_STEP_(\d+)$/);
            if (match) {
              window.lastScreenStep = parseInt(match[1], 10);
              break;
            }
          }
        }
        e.preventDefault();
        $("#ztWithdrawConfirmModal").modal("show");
      });
    }
    const triggerBtn = document.getElementById("ztWithdrawTrigger");
    if (
      triggerBtn &&
      !triggerBtn.classList.contains("zt-withdraw-listener-attached")
    ) {
      triggerBtn.classList.add("zt-withdraw-listener-attached");
      triggerBtn.addEventListener("click", () => {
        $("#ztWithdrawConfirmModal").modal("show");
      });
    }
    const yesBtn = document.getElementById("ztConfirmWithdrawYes");
    if (yesBtn && !yesBtn.classList.contains("zt-withdraw-listener-attached")) {
      yesBtn.classList.add("zt-withdraw-listener-attached");
      yesBtn.addEventListener("click", () => {
        $("#ztWithdrawConfirmModal").modal("hide");
        setTimeout(() => {
          $("#ztWithdrawReasonModal").modal("show");
        }, 300);
      });
    }
    const noBtn = document.getElementById("ztConfirmWithdrawNo");
    const closeBtn = document.getElementById("ztConfirmWithdrawClose");
    function attachWithdrawGoBackHandler(btn) {
      if (btn && !btn.classList.contains("zt-withdraw-no-listener-attached")) {
        btn.classList.add("zt-withdraw-no-listener-attached");
        btn.addEventListener("click", () => {
          const navigationHistory = getNavigationHistory();
          if (navigationHistory.length < 2) return;
          let targetIndex = -2;
          const prevNodeId = navigationHistory.at(-2)?.node_id;
          const prevNodeEl = document.querySelector(
            `.zingtree-node[data-node-id="${prevNodeId}"]`,
          );
          if (prevNodeEl?.classList.contains("tag_WITHDRAWL_STEP")) {
            targetIndex = -3;
          }
          const goBackToNodeId = navigationHistory.at(targetIndex)?.node_id;
          if (goBackToNodeId) {
            setTimeout(() => {
              do_button_click(goBackToNodeId);
            }, 300);
          }
        });
      }
    }
    attachWithdrawGoBackHandler(noBtn);
    attachWithdrawGoBackHandler(closeBtn);
  }, 100);
});
const wrapper = document.querySelector(".widewrapper.main.ma-4");
if (wrapper) {
  observer.observe(wrapper, { childList: !0, subtree: !0 });
}
document.addEventListener("click", function (e) {
  const target = e.target;
  if (
    target &&
    (target.matches('[data-test^="zt-action-button"]') ||
      target.classList.contains("btn-zingtree"))
  ) {
    if (currentStepIndex < 3) {
      currentStepIndex++;
    }
  }
  if (target && target.id === "back_button" && currentStepIndex > 0) {
    currentStepIndex--;
  }
});
function injectDynamicBackground(isFirstNode) {
  const existingBgStyle = document.getElementById("zt-bg-style");
  if (existingBgStyle) existingBgStyle.remove();
  const style = document.createElement("style");
  style.id = "zt-bg-style";
  style.innerHTML = `
                  .app-container,
                  .widewrapper.main {
                    background: linear-gradient(to bottom, #0033a0 50%, #ffffff 50%);
                  }

                  @media (max-width: 767px) {
                    ${
                      isFirstNode
                        ? `.app-container,.widewrapper.main{background:#0033a0!important}
`
                        : ""
                    }
                  }
                `;
  document.head.appendChild(style);
}
function customizeFileInputs() {
  const fileInputs = document.querySelectorAll(
    '.form-field-container input[type="file"]',
  );
  fileInputs.forEach((input, index) => {
    const container = input.closest(".form-field-container");
    if (!container || container.classList.contains("zt-customized")) return;
    const parent = input.closest(".v-input");
    const helpText = container.querySelector(".text-caption");
    if (parent) parent.style.display = "none";
    if (helpText) helpText.style.display = "none";
    const label = container.querySelector("label");
    label.style.overflow = "visible";
    const labelSpan = container.querySelector("label");
    const evidenceType = label.id.split("-")[0];
    const colWrapper = container.closest('[data-test^="form-fields--"]');
    $(colWrapper).css({ paddingRight: "8px" });
    colWrapper?.classList.add(`form-field-type${index + 1}`);
    $(colWrapper).addClass("v-col-md-3").removeClass("v-col-md-12");
    labelSpan &&
      !labelSpan.querySelector("img") &&
      addTooltipToLabel(labelSpan, index);
    $(labelSpan).css({ height: "40px" });
    const buildUploadBlock = (
      modalId,
      isFirstBlock = !1,
      evidenceType = "",
    ) => {
      const wrapper = document.createElement("div");
      wrapper.className = "zt-custom-upload";
      const uploadBody = $("<div>", { class: "zt-upload-body" });
      const uploadButton = $("<button>", {
        class: "zt-upload-btn",
        "data-upload-role": "primary-upload-btn",
        "data-evidence-type": evidenceType,
        "data-toggle": "modal",
        "data-target": `#${modalId}`,
        html: "Upload document",
      });
      const cannotProvideButton = $("<button>", {
        class: "cannot-provide-cta",
        css: {
          backgroundColor: "#ed7766",
          color: "#fff",
          borderRadius: "4px",
          fontSize: "14px",
          padding: "10px 12px",
          cursor: "pointer",
        },
        text: "Cannot Provide",
      }).click(function () {
        const uploadCommentsBox = $(this)
          .closest(".form-field-container")
          .siblings(".upload-comments-box");
        uploadCommentsBox.is(":hidden")
          ? uploadCommentsBox.show()
          : uploadCommentsBox.hide();
      });
      const $buttonsContainer = $("<div>", {
        css: {
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flexGrow: "1",
        },
      }).append([uploadButton, cannotProvideButton]);
      uploadBody.append([$buttonsContainer]);
      wrapper.append(uploadBody.get(0));
      document.body.insertAdjacentHTML("beforeend", createModalHTML(modalId));
      $(`#${modalId}`).on("hidden.bs.modal", function () {
        const fileInput = document.getElementById(`${modalId}_fileInput`);
        const urlInput = document.getElementById(`${modalId}_url`);
        const fileName = document.getElementById(`${modalId}_fileName`);
        const fileSize = document.getElementById(`${modalId}_fileSize`);
        const preview = document.getElementById(`${modalId}_filePreview`);
        const icon = document.getElementById(`${modalId}_icon`);
        const attachBtn = document.getElementById(`${modalId}_attachBtn`);
        const confirmAttach = document.getElementById(
          `${modalId}_confirmAttach`,
        );
        const fileError = document.getElementById(`${modalId}_fileError`);
        if (fileInput) fileInput.value = "";
        if (urlInput) urlInput.value = "";
        if (fileName) fileName.textContent = "";
        if (fileSize) fileSize.textContent = "";
        if (fileError) {
          fileError.textContent = "";
          fileError.style.display = "none";
        }
        if (preview) preview.style.display = "none";
        if (confirmAttach) confirmAttach.style.display = "none";
        if (icon) icon.style.display = "block";
        if (attachBtn) attachBtn.style.display = "inline-block";
      });
      const fileInput = document.getElementById(`${modalId}_fileInput`);
      const attachBtn = document.getElementById(`${modalId}_attachBtn`);
      const preview = document.getElementById(`${modalId}_filePreview`);
      const fileName = document.getElementById(`${modalId}_fileName`);
      const fileSize = document.getElementById(`${modalId}_fileSize`);
      const confirmAttach = document.getElementById(`${modalId}_confirmAttach`);
      const urlInput = document.getElementById(`${modalId}_url`);
      const uploadUrlBtn = document.getElementById(`${modalId}_uploadUrlBtn`);
      const icon = document.getElementById(`${modalId}_icon`);
      attachBtn.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        const errorEl = document.getElementById(`${modalId}_fileError`);
        if (!file || !errorEl) return;
        const allowedExtensions = ["jpg", "jpeg", "png", "heic", "pdf", "docx"];
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          errorEl.textContent =
            "Invalid file format. Allowed formats: jpg, jpeg, png, heic, pdf, docx";
          errorEl.style.display = "block";
          fileInput.value = "";
          return;
        }
        errorEl.style.display = "none";
        fileName.textContent = file.name;
        fileSize.textContent = Math.round(file.size / 1024) + "kb";
        icon.style.display = "none";
        attachBtn.style.display = "none";
        preview.style.display = "flex";
        confirmAttach.style.display = "inline-block";
      });
      urlInput.addEventListener("input", () => {
        const url = urlInput.value.trim();
        uploadUrlBtn.disabled = !/^https?:\/\/.+\..+/.test(url);
      });
      uploadUrlBtn.addEventListener("click", () => {
        const url = urlInput.value.trim();
        if (url) {
          fileName.textContent = url.split("/").pop();
          fileSize.textContent = "From URL";
          icon.style.display = "none";
          attachBtn.style.display = "none";
          preview.style.display = "block";
          confirmAttach.style.display = "inline-block";
        }
      });
      confirmAttach.addEventListener("click", async () => {
        const file = fileInput.files[0];
        const url = urlInput.value.trim();
        const uploadedName = file ? file.name : url.split("/").pop();
        const uploadedSize = file
          ? Math.round(file.size / 1024) + "kb"
          : "From URL";
        let downloadUrl = "";
        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          //valut file changes
          formData.append("file_type", "vault");
          formData.append("current_workflow_id", `${this_tree_id}`);
          formData.append("node_id", `${this_node_id}`);
          //valut file changes

          const $confirmAttach = $(confirmAttach);
          const confirmAttachInnerHtml = $confirmAttach.html();
          try {
            $confirmAttach.empty();
            $confirmAttach.html(
              $("<i>", {
                class: "rotating mdi mdi-loading",
                css: { display: "block" },
              }),
            );
            const response = await fetch(
              "https://zingtree.com/rev2-svc/upload-file",
              {
                credentials: "omit",
                referrer: "",
                method: "POST",
                headers: { "X-Org-Id": ORG_ID,
            "X-Session-Id": `${session_id}`,
            "X-Tree-Id": this_tree_id, },
                body: formData,
              },
            );
            if (!response.ok) throw new Error("Upload failed");
            const result = await response.json();
            downloadUrl = result.download_url;
            file_uid = result.file_uid;
            if (file_uid && evidenceType) {
              const dynamicKey = `${evidenceType}`;
              assignSessionVar(dynamicKey, file_uid);
              assignSessionVar(`${evidenceType}_mime_type`, file.type);
              assignSessionVar(`${evidenceType}_file_name`, file.name);
            }
            $confirmAttach.html(confirmAttachInnerHtml);
          } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload file.");
            $confirmAttach.html(confirmAttachInnerHtml);
            return;
          }
        }
        $(`#${modalId}`).modal("hide");
        setTimeout(() => {
          do_button_click(32);
        }, 300);
      });
      return wrapper;
    };
    const firstModalId = `ztUploadModal_${Math.random()
      .toString(36)
      .substr(2, 8)}`;
    firstUploadModalId = firstModalId;
    const firstBlock = buildUploadBlock(firstModalId, !0, evidenceType);
    container.appendChild(firstBlock);
    container.classList.add("zt-customized");
  });
}
function updateUploadButtonState(container) {
  const uploadedDocsContainer = container.querySelector(
    ".uploaded-documents-container",
  );
  const uploadedCount = uploadedDocsContainer
    ? uploadedDocsContainer.querySelectorAll(".zt-upload-body").length
    : 0;
  const uploadButton = container.querySelector(
    '[data-upload-role="primary-upload-btn"]',
  );
  if (uploadButton) {
    const isDisabled = uploadedCount >= 3;
    uploadButton.disabled = isDisabled;
    uploadButton.style.pointerEvents = isDisabled ? "none" : "auto";
    uploadButton.style.opacity = isDisabled ? "0.5" : "1";
  }
}
function attachAmendPopupTrigger() {
  const $amendBoxes = $(".amend-box").toArray();
  if (!$amendBoxes[0]) return;
  $amendBoxes.forEach((amendBox) => {
    if (!amendBox) return;
    const amendText = $(amendBox).find("#amend-text").get(0);
    const evidenceTypeId = $(amendBox)
      .find(".proof-container-box")
      .attr("evidence-type-id");
    const evidenceType = getEvidenceTypeById(evidenceTypeId);
    if (!amendText || amendText.classList.contains("zt-amend-popup-attached"))
      return;
    amendText.classList.add("zt-amend-popup-attached");
    amendText.style.cursor = "pointer";
    const modalId = "ztFallbackUploadModal";
    if (!document.getElementById(modalId)) {
      document.body.insertAdjacentHTML("beforeend", createModalHTML(modalId));
    }
    amendText.addEventListener("click", () => {
      const fileInput = document.getElementById(`${modalId}_fileInput`);
      const urlInput = document.getElementById(`${modalId}_url`);
      const fileName = document.getElementById(`${modalId}_fileName`);
      const fileSize = document.getElementById(`${modalId}_fileSize`);
      const preview = document.getElementById(`${modalId}_filePreview`);
      const icon = document.getElementById(`${modalId}_icon`);
      const attachBtn = document.getElementById(`${modalId}_attachBtn`);
      const closeBtn = document.getElementById(`${modalId}_closeBtn`);
      let confirmAttach = document.getElementById(`${modalId}_confirmAttach`);
      confirmAttach.parentNode.replaceChild(
        confirmAttach.cloneNode(!0),
        confirmAttach,
      );
      confirmAttach = document.getElementById(`${modalId}_confirmAttach`);
      const uploadUrlBtn = document.getElementById(`${modalId}_uploadUrlBtn`);
      const errorEl = document.getElementById(`${modalId}_fileError`);
      if (fileInput) fileInput.value = "";
      if (urlInput) urlInput.value = "";
      if (fileName) fileName.textContent = "";
      if (fileSize) fileSize.textContent = "";
      if (preview) preview.style.display = "none";
      if (confirmAttach) confirmAttach.style.display = "none";
      if (icon) icon.style.display = "block";
      if (attachBtn) attachBtn.style.display = "inline-block";
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.style.display = "none";
      }
      $(`#${modalId}`).modal("show");
      [fileInput, urlInput, confirmAttach, attachBtn, uploadUrlBtn].forEach(
        (el) => el?.classList.remove("zt-listener-attached"),
      );
      if (!attachBtn.classList.contains("zt-listener-attached")) {
        attachBtn.classList.add("zt-listener-attached");
        attachBtn.addEventListener("click", (e) => {
          e.stopImmediatePropagation();
          e.stopPropagation();
          fileInput.click();
        });
        closeBtn.addEventListener("click", () => {
          fileInput.value = null;
          [fileInput, urlInput, confirmAttach, attachBtn, uploadUrlBtn].forEach(
            (el) => el?.classList.remove("zt-listener-attached"),
          );
        });
      }
      if (!fileInput.classList.contains("zt-listener-attached")) {
        fileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const allowedExtensions = [
            "jpg",
            "jpeg",
            "png",
            "heic",
            "pdf",
            "docx",
          ];
          const ext = file.name.split(".").pop().toLowerCase();
          if (!allowedExtensions.includes(ext)) {
            errorEl.textContent =
              "Invalid file format. Allowed formats: jpg, jpeg, png, heic, pdf, docx";
            errorEl.style.display = "block";
            preview.style.display = "none";
            confirmAttach.style.display = "none";
            icon.style.display = "block";
            attachBtn.style.display = "inline-block";
            return;
          }
          errorEl.style.display = "none";
          fileName.textContent = file.name;
          fileSize.textContent = Math.round(file.size / 1024) + "kb";
          icon.style.display = "none";
          attachBtn.style.display = "none";
          preview.style.display = "flex";
          confirmAttach.style.display = "inline-block";
        });
        fileInput.classList.add("zt-listener-attached");
      }
      if (!urlInput.classList.contains("zt-listener-attached")) {
        urlInput.classList.add("zt-listener-attached");
        urlInput.addEventListener("input", () => {
          const url = urlInput.value.trim();
          uploadUrlBtn.disabled = !/^https?:\/\/.+\..+/.test(url);
        });
      }
      if (!uploadUrlBtn.classList.contains("zt-listener-attached")) {
        uploadUrlBtn.classList.add("zt-listener-attached");
        uploadUrlBtn.addEventListener("click", () => {
          const url = urlInput.value.trim();
          if (!url) return;
          fileName.textContent = url.split("/").pop();
          fileSize.textContent = "From URL";
          icon.style.display = "none";
          attachBtn.style.display = "none";
          preview.style.display = "block";
          confirmAttach.style.display = "inline-block";
        });
      }
      if (!confirmAttach.classList.contains("zt-listener-attached")) {
        confirmAttach.classList.add("zt-listener-attached");
        confirmAttach.addEventListener("click", async (e) => {
          e.stopImmediatePropagation();
          e.stopPropagation();
          const file = fileInput.files[0];
          fileInput.value = null;
          const url = urlInput.value.trim();
          const uploadedName = file ? file.name : url.split("/").pop();
          const amendParent = amendBox.closest(".v-col-12[data-test]");
          const originalHtml = confirmAttach.innerHTML;
          let evidenceKey = "";
          evidenceKey = evidenceType + "_actions";
          let downloadUrl = "";
          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            const $confirmAttach = $(confirmAttach);
            const confirmAttachInnerHtml = $confirmAttach.html();
            try {
              $confirmAttach.empty();
              $confirmAttach.html(
                $("<i>", {
                  class: "rotating mdi mdi-loading",
                  css: { display: "block" },
                }),
              );
              const response = await fetch(
                "https://zingtree.com/rev2-svc/upload-file",
                {
                  credentials: "omit",
                  referrer: "",
                  method: "POST",
                  headers: {
                    "X-Org-Id": ORG_ID,
            "X-Session-Id": `${session_id}`,
            "X-Tree-Id": this_tree_id,
                  },
                  body: formData,
                },
              );
              if (!response.ok) throw new Error("Upload failed");
              const result = await response.json();
              downloadUrl = result.download_url;
            } catch (err) {
              alert("Failed to upload file.");
              console.error(err);
              confirmAttach.innerHTML = confirmAttachInnerHtml;
              return;
            }
            confirmAttach.innerHTML = confirmAttachInnerHtml;
          }
          if (!downloadUrl && url) {
            downloadUrl = url;
          }
          if (downloadUrl && evidenceKey) {
            assignSessionVar(evidenceKey, downloadUrl);
          }
          $(`#${modalId}`).modal("hide");
          const fileRow = document.createElement("div");
          fileRow.className = "zt-upload-body zt-amend-uploaded-file";
          fileRow.style.justifyContent = "space-between";
          fileRow.style.marginTop = "10px";
          fileRow.style.display = "flex";
          fileRow.style.alignItems = "center";
          const nameSpan = document.createElement("span");
          nameSpan.style.color = "#0a1f44";
          nameSpan.style.fontWeight = "500";
          nameSpan.style.textDecoration = "underline";
          nameSpan.textContent = uploadedName;
          const deleteIcon = document.createElement("img");
          deleteIcon.src =
            "https://assets.zingtree.com/managed/squaretrade/claims_validation/icons/bin.png";
          deleteIcon.alt = "Delete";
          deleteIcon.style.width = "18px";
          deleteIcon.style.height = "18px";
          deleteIcon.style.cursor = "pointer";
          deleteIcon.addEventListener("click", () => {
            fileRow.remove();
          });
          fileRow.append(nameSpan, deleteIcon);
          const existing = amendBox.querySelector(".zt-amend-uploaded-file");
          if (existing) {
            amendBox.insertBefore(fileRow, existing);
          } else {
            amendBox.appendChild(fileRow);
          }
          setTimeout(() => {
            if (downloadUrl) {
              console.log("🙈GOING TO PAGE 32");
              console.log(`${evidenceKey} -  ${downloadUrl}`);
              do_button_click(32);
            }
          }, 100);
        });
      }
    });
  });
}
function addCheckIconsToDropdown() {
  const listItems = document.querySelectorAll(
    ".v-overlay-container .v-list-item",
  );
  listItems.forEach((item) => {
    if (item.classList.contains("zt-check-icon-added")) return;
    item.classList.add("zt-check-icon-added");
    const checkIcon = document.createElement("img");
    checkIcon.src =
      "https://assets.zingtree.com/managed/squaretrade/claims_validation/icons/tick.png";
    checkIcon.alt = "Checkmark";
    checkIcon.style.width = "20px";
    checkIcon.style.height = "20px";
    checkIcon.style.opacity = "0.3";
    checkIcon.style.marginLeft = "auto";
    checkIcon.className = "zt-check-icon";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.appendChild(checkIcon);
  });
  setTimeout(() => {
    listItems.forEach((item) => {
      const icon = item.querySelector(".zt-check-icon");
      if (!icon) return;
      icon.style.opacity = item.classList.contains("v-list-item--active")
        ? "1"
        : "0.3";
    });
  }, 100);
}
function enhanceDropdownInputs() {
  const dropdownIcons = document.querySelectorAll("i.mdi-menu-down");
  dropdownIcons.forEach((icon) => {
    if (icon.classList.contains("zt-replaced-chevron")) return;
    icon.classList.remove("mdi-menu-down");
    icon.classList.add("mdi-chevron-down");
  });
}
function attachCheckIconOnBlur() {
  const inputs = document.querySelectorAll(
    ".form-field-container input.v-field__input",
  );
  inputs.forEach((input) => {
    input.removeEventListener("blur", handleInputBlur);
    input.addEventListener("blur", handleInputBlur);
  });
  function handleInputBlur(e) {
    const input = e.target;
    const value = input.value.trim();
    const parentField = input.closest(".v-field");
    if (!parentField) return;
    const oldIcon = parentField.querySelector("img.zt-check-icon");
    if (oldIcon) oldIcon.remove();
    if (input.id === "claim_id") {
      const isValidClaimID = /^0\d{11}$/.test(value);
      if (!isValidClaimID) return;
    } else {
      if (value === "") return;
    }
    const icon = document.createElement("img");
    icon.src =
      "https://assets.zingtree.com/managed/squaretrade/claims_validation/icons/tick.png";
    icon.alt = "Checkmark";
    icon.className = "zt-check-icon";
    icon.style.width = "24px";
    icon.style.height = "24px";
    icon.style.position = "absolute";
    icon.style.right = "10px";
    icon.style.top = "50%";
    icon.style.transform = "translateY(-50%)";
    icon.style.zIndex = "1";
    parentField.style.position = "relative";
    parentField.style.backgroundColor = "transparent";
    parentField.appendChild(icon);
  }
}
function insertWideScreenHeading() {
  const wideScreenHeading = document.querySelector("#wide-screen-heading");
  if (wideScreenHeading) return;
  const documentHeadingContainer = document.querySelector(
    "span#node-title > span",
  );
  if (!documentHeadingContainer) return;
  const documentHeading = documentHeadingContainer.innerHTML;
  if (documentHeading) {
    const wideScreenHeading = document.createElement("p");
    wideScreenHeading.id = "wide-screen-heading";
    wideScreenHeading.innerHTML += documentHeading;
    const contentNodeBody = document.querySelector(
      ".content-node-html.text-left",
    );
    contentNodeBody && contentNodeBody.prepend(wideScreenHeading);
  }
}
function validateClaimID() {
  const claimInput = document.querySelector("input#claim_id");
  const messageBox = document.querySelector("#claim_id-messages");
  const fieldWrapper = claimInput?.closest(".v-field");
  const submitBtn = document.querySelector('[data-test^="zt-action-button"]');
  if (!claimInput || !messageBox || !fieldWrapper || !submitBtn) return;
  const updateButtonState = () => {
    const value = claimInput.value.trim();
    const isValid = /^0\d{11}$/.test(value);
    messageBox.textContent = "";
    messageBox.style.color = "";
    messageBox.style.fontWeight = "";
    fieldWrapper.style.border = "none";
    if (!value || !isValid) {
      if (value && !isValid) {
        messageBox.textContent =
          "Claim ID is a 12-digit number – you can find this on your email";
        messageBox.style.color = "red";
        messageBox.style.fontWeight = "500";
        fieldWrapper.style.border = "2px solid red";
      }
      submitBtn.style.pointerEvents = "none";
      submitBtn.classList.add("disabled-submit");
    } else {
      submitBtn.style.pointerEvents = "auto";
      submitBtn.classList.remove("disabled-submit");
    }
  };
  updateButtonState();
  claimInput.addEventListener("input", updateButtonState);
  claimInput.addEventListener("blur", updateButtonState);
}
function makeProvideDocumentationNodeDesignResponsive() {
  const errorMessage = $("#duplicate-document-error-message");
  if (
    errorMessage.html() !== "" &&
    (checkNodeTag("STEP_2") || checkNodeTag("STARTNODE"))
  ) {
    const icon = errorMessage.find(".mdi-alert-circle");
    if (icon.length === 0) {
      const cautionIcon = $(
        "<span style='color: red !important; padding-right:5px'>",
      ).addClass("mdi mdi-alert-circle");
      errorMessage.prepend(cautionIcon);
    }
  }
  const wideScreenHeadingElement = document.querySelector(
    "p#wide-screen-heading",
  );
  if (!wideScreenHeadingElement) return;
  const isProvideDocumentationPage =
    wideScreenHeadingElement.innerHTML === "Provide documentation";
  if (!isProvideDocumentationPage) return;
  $("form").closest(".v-row.content-answer").css({ margin: "0px" });
  $("form > .v-row").css({ margin: "0px" });
}
function injectWithdrawalDropdownIntoModalWithWait(retries = 10) {
  requestAnimationFrame(() => {
    const zingtreeDropdownWrapper = Array.from(
      document.querySelectorAll("label"),
    )
      .find((label) => label.textContent.includes("Withdrawal Claim"))
      ?.closest(".form-field-container");
    const modalBody = document.querySelector(
      "#ztWithdrawReasonModal .modal-body",
    );
    if (!zingtreeDropdownWrapper || !modalBody) {
      if (retries > 1) {
        injectWithdrawalDropdownIntoModalWithWait(retries - 1);
      }
      return;
    }
    if (modalBody.classList.contains("zt-dropdown-injected")) return;
    zingtreeDropdownWrapper.id = "ztModalWithdrawalDropdown";
    modalBody.insertBefore(
      zingtreeDropdownWrapper,
      modalBody.querySelector("button.zt-upload-btn"),
    );
    modalBody.classList.add("zt-dropdown-injected");
  });
}
function updateNextButtonForEvidenceSections() {
  const buttons = document.querySelectorAll('[data-test^="zt-action-button"]');
  let nextBtn = null;
  for (const btn of buttons) {
    if (btn.textContent.trim().toLowerCase() !== "submit") {
      nextBtn = btn;
      break;
    }
  }
  if (!nextBtn) return;
  const requiredSelectors = [
    ".form-field-type1",
    ".form-field-type2",
    ".form-field-type3",
    ".form-field-type4",
    ".form-field-type5",
    ".form-field-type6",
    ".form-field-type7",
    ".form-field-type8",
    ".form-field-type9",
  ];
  const allValid = requiredSelectors.every((selector) => {
    const fieldWrapper = document.querySelector(selector);
    if (!fieldWrapper || fieldWrapper.offsetParent === null) return !0;
    const uploadedContainer = fieldWrapper.querySelector(
      ".uploaded-documents-container",
    );
    const hasUploaded =
      uploadedContainer && uploadedContainer.children.length > 0;
    if (hasUploaded) return !0;
    const textarea = fieldWrapper.querySelector(
      ".upload-comments-box textarea",
    );
    return textarea && textarea.value.trim().length > 0;
  });
  nextBtn.style.pointerEvents = allValid ? "auto" : "none";
  nextBtn.style.opacity = allValid ? "1" : "0.6";
  nextBtn.classList.toggle("disabled-submit", !allValid);
}
function enableSubmitOnTellUsWhatHappenedInput() {
  const textarea = document.getElementById("tell_us_what_happend_comments");
  const allButtons = document.querySelectorAll(
    '[data-test^="zt-action-button"]',
  );
  let submitBtn = null;
  for (const btn of allButtons) {
    if (btn.textContent.trim().toLowerCase() === "submit") {
      submitBtn = btn;
      break;
    }
  }
  if (!textarea || !submitBtn) return;
  if (!submitBtn.id) {
    submitBtn.id = "ztSubmitBtn";
  }
  const updateSubmitButtonState = () => {
    const hasText = textarea.value.trim().length > 0;
    submitBtn.style.pointerEvents = hasText ? "auto" : "none";
    submitBtn.style.opacity = hasText ? "1" : "0.6";
    submitBtn.classList.toggle("disabled-submit", !hasText);
  };
  if (!textarea.classList.contains("zt-listener-attached")) {
    textarea.classList.add("zt-listener-attached");
    textarea.addEventListener("input", updateSubmitButtonState);
  }
  updateSubmitButtonState();
}
function updateTellUsWhatHappenedScreenBackButtonDesign() {
  const $isWhatHappenedScreen = $(".zingtree-node.tag_what-happened");
  if (!$isWhatHappenedScreen) return;
  $(".answers").find(".btn-outline-primary").css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  });
}
function appendCommentsBoxToUploadFields() {
  if ($(".upload-comments-box").length > 0) return;
  $(".zt-upload-body")
    .toArray()
    .forEach((ztUploadBody, index) => {
      const evidenceType = $(ztUploadBody)
        .find(".zt-upload-btn")
        .attr("data-evidence-type");
      const correspondingCommentsBox = $(`#${evidenceType}_comments-label`)
        .parent("div")
        .addClass("upload-comments-box")
        .hide();
      const correspondingCommentsBoxWrapper = correspondingCommentsBox.closest(
        "[data-test='form-fields--1']",
      );
      const uploadWrapper = $(ztUploadBody)
        .closest(".form-field-container.zt-customized")
        .after(correspondingCommentsBox);
      correspondingCommentsBoxWrapper.remove();
    });
}
function addTooltipToLabel(labelSpan, index) {
  if ($(labelSpan).find("img").length > 0) return;
  const evidenceType = $(labelSpan).attr("id").split("-")[0];
  if (!Object.keys(tooltipsContentForEvidencePage).includes(evidenceType))
    return;
  let tooltipContent = tooltipsContentForEvidencePage[evidenceType];
  const icon = $("<img>")
    .attr(
      "src",
      "https://assets.zingtree.com/managed/squaretrade/claims_validation/icons/question_mark.png",
    )
    .attr("data-toggle", "tooltip")
    .attr("title", tooltipContent)
    .css({ marginLeft: "6px", width: "16px" })
    .addClass("tooltip-icon")
    .tooltip({
      html: !0,
      container: "body",
      placement: "auto",
      trigger: "manual",
    })
    .on("mouseenter", function () {
      const $this = $(this);
      $this.tooltip("show");
      $(".tooltip")
        .on("mouseenter", function () {
          clearTimeout($this.data("timeoutId"));
        })
        .on("mouseleave", function () {
          $this.tooltip("hide");
        });
    })
    .on("mouseleave", function () {
      const $this = $(this);
      const timeoutId = setTimeout(() => {
        $this.tooltip("hide");
      }, 200);
      $this.data("timeoutId", timeoutId);
    });
  $(labelSpan).append(icon);
}
