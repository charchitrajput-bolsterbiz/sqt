

const EVIDENCE_TYPE_TO_ID_MAP = {
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

const TOOLTIPS_CONTENT_FOR_EVIDENCE_PAGE = {
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

function getEvidenceTypeById(idNumber) {
  const id = Number(idNumber);
  if (isNaN(id)) return null;
  for (const [key, value] of Object.entries(EVIDENCE_TYPE_TO_ID_MAP)) {
    if (value === id) {
      return key;
    }
  }
  return null;
}


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


function checkNodeTag(nodeTag) {
  return $(`.zingtree-node.tag_${nodeTag}`).length > 0;
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